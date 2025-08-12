import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LiveLocationFormService, LiveLocationFormGroup } from './live-location-form.service';
import { ILiveLocation } from '../live-location.model';
import { LiveLocationService } from '../service/live-location.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { Geopoint } from 'app/entities/enumerations/geopoint.model';

@Component({
  selector: 'jhi-live-location-update',
  templateUrl: './live-location-update.component.html',
})
export class LiveLocationUpdateComponent implements OnInit {
  isSaving = false;
  liveLocation: ILiveLocation | null = null;
  geopointValues = Object.keys(Geopoint);

  usersSharedCollection: IUser[] = [];

  editForm: LiveLocationFormGroup = this.liveLocationFormService.createLiveLocationFormGroup();

  constructor(
    protected liveLocationService: LiveLocationService,
    protected liveLocationFormService: LiveLocationFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ liveLocation }) => {
      this.liveLocation = liveLocation;
      if (liveLocation) {
        this.updateForm(liveLocation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const liveLocation = this.liveLocationFormService.getLiveLocation(this.editForm);
    if (liveLocation.id !== null) {
      this.subscribeToSaveResponse(this.liveLocationService.update(liveLocation));
    } else {
      this.subscribeToSaveResponse(this.liveLocationService.create(liveLocation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILiveLocation>>): void {
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

  protected updateForm(liveLocation: ILiveLocation): void {
    this.liveLocation = liveLocation;
    this.liveLocationFormService.resetForm(this.editForm, liveLocation);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, liveLocation.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.liveLocation?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
