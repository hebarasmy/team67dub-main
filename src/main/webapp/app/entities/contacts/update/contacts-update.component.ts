import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ContactsFormService, ContactsFormGroup } from './contacts-form.service';
import { IContacts } from '../contacts.model';
import { ContactsService } from '../service/contacts.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISOSButton } from 'app/entities/sos-button/sos-button.model';
import { SOSButtonService } from 'app/entities/sos-button/service/sos-button.service';
import { RelationshipType } from 'app/entities/enumerations/relationship-type.model';

@Component({
  selector: 'jhi-contacts-update',
  templateUrl: './contacts-update.component.html',
})
export class ContactsUpdateComponent implements OnInit {
  isSaving = false;
  contacts: IContacts | null = null;
  relationshipTypeValues = Object.keys(RelationshipType);

  usersSharedCollection: IUser[] = [];
  sOSButtonsSharedCollection: ISOSButton[] = [];

  editForm: ContactsFormGroup = this.contactsFormService.createContactsFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected contactsService: ContactsService,
    protected contactsFormService: ContactsFormService,
    protected userService: UserService,
    protected sOSButtonService: SOSButtonService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareSOSButton = (o1: ISOSButton | null, o2: ISOSButton | null): boolean => this.sOSButtonService.compareSOSButton(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contacts }) => {
      this.contacts = contacts;
      if (contacts) {
        this.updateForm(contacts);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contacts = this.contactsFormService.getContacts(this.editForm);
    if (contacts.id !== null) {
      this.subscribeToSaveResponse(this.contactsService.update(contacts));
    } else {
      this.subscribeToSaveResponse(this.contactsService.create(contacts));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContacts>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(contacts: IContacts): void {
    this.contacts = contacts;
    this.contactsFormService.resetForm(this.editForm, contacts);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      ...(contacts.users ?? [])
    );
    this.sOSButtonsSharedCollection = this.sOSButtonService.addSOSButtonToCollectionIfMissing<ISOSButton>(
      this.sOSButtonsSharedCollection,
      contacts.sOSButton
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, ...(this.contacts?.users ?? []))))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.sOSButtonService
      .query()
      .pipe(map((res: HttpResponse<ISOSButton[]>) => res.body ?? []))
      .pipe(
        map((sOSButtons: ISOSButton[]) =>
          this.sOSButtonService.addSOSButtonToCollectionIfMissing<ISOSButton>(sOSButtons, this.contacts?.sOSButton)
        )
      )
      .subscribe((sOSButtons: ISOSButton[]) => (this.sOSButtonsSharedCollection = sOSButtons));
  }
}
