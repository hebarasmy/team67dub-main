import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IContacts } from '../contacts.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ContactsService } from '../service/contacts.service';
import { ContactsDeleteDialogComponent } from '../delete/contacts-delete-dialog.component';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { ContactsFormService } from '../update/contacts-form.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISOSButton } from 'app/entities/sos-button/sos-button.model';
import { SOSButtonService } from 'app/entities/sos-button/service/sos-button.service';
import { RelationshipType } from 'app/entities/enumerations/relationship-type.model';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'jhi-contacts',
  templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit {
  contacts?: IContacts[];
  isLoading = false;
  isSaving = false;
  isSpinning = false;
  relationshipTypeValues = Object.keys(RelationshipType);
  users: any[] = [];
  fontSizes: number[] = [14, 16, 17, 18, 20, 22, 24]; // Define font sizes
  selectedFontSize: number = 17; // Default selected font size

  predicate = 'id';
  ascending = true;

  showDialog = false;

  editForm: FormGroup;

  constructor(
    protected contactsService: ContactsService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected eventManager: EventManager,
    protected contactsFormService: ContactsFormService,
    protected userService: UserService,
    protected sOSButtonService: SOSButtonService,
    protected elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.editForm = this.formBuilder.group({
      id: [null],
      image: [null],
      imageContentType: [null],
      contactName: [null, Validators.required], // Require a name
      contactPhone: [null, Validators.required], // Require a phone number
      contactRelation: [null],
    });
  }

  trackId = (_index: number, item: IContacts): number => this.contactsService.getContactsIdentifier(item);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareSOSButton = (o1: ISOSButton | null, o2: ISOSButton | null): boolean => this.sOSButtonService.compareSOSButton(o1, o2);

  ngOnInit(): void {
    this.load();
    this.http.get<any[]>('/api/users').subscribe(users => {
      console.log(users); // Log the users array to the console
      this.users = users;
    });
  }

  openEditDialog(contacts: IContacts): void {
    // Populate the edit form with the selected contact's data
    this.editForm.patchValue(contacts);

    // Open the dialog box
    this.openDialog();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  openDialog() {
    this.showDialog = true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  closeDialog() {
    this.editForm.reset();
    this.showDialog = false;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(contacts: IContacts): void {
    const modalRef = this.modalService.open(ContactsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.contacts = contacts;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
    this.isSpinning = true;
    setTimeout(() => {
      this.isSpinning = false;
    }, 1000);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.contacts = this.refineData(dataFromBody);
  }

  protected refineData(data: IContacts[]): IContacts[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IContacts[] | null): IContacts[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.contactsService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContacts>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  previousState(): void {
    this.closeDialog();
    this.load();
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  isFormValid(): boolean {
    return this.editForm.valid;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  save(): void {
    if (this.isFormValid()) {
      // Save the form data
      this.isSaving = true;
      const contacts = this.contactsFormService.getContacts(this.editForm);
      if (contacts.id !== null) {
        this.subscribeToSaveResponse(this.contactsService.update(contacts));
      } else {
        this.subscribeToSaveResponse(this.contactsService.create(contacts));
      }
    } else {
      // Form is invalid, handle accordingly (e.g., show error message)
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }
}
