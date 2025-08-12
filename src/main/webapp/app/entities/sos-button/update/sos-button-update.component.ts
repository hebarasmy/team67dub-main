import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SOSButtonFormService, SOSButtonFormGroup } from './sos-button-form.service';
import { ISOSButton } from '../sos-button.model';
import { SOSButtonService } from '../service/sos-button.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { LiveLocationService } from 'app/entities/live-location/service/live-location.service';
import { Geopoint } from 'app/entities/enumerations/geopoint.model';

@Component({
  selector: 'jhi-sos-button-update',
  templateUrl: './sos-button-update.component.html',
})
export class SOSButtonUpdateComponent implements OnInit {
  isSaving = false;
  sOSButton: ISOSButton | null = null;
  geopointValues = Object.keys(Geopoint);

  usersSharedCollection: IUser[] = [];
  liveLocationsCollection: ILiveLocation[] = [];

  editForm: SOSButtonFormGroup = this.sOSButtonFormService.createSOSButtonFormGroup();

  constructor(
    protected sOSButtonService: SOSButtonService,
    protected sOSButtonFormService: SOSButtonFormService,
    protected userService: UserService,
    protected liveLocationService: LiveLocationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareLiveLocation = (o1: ILiveLocation | null, o2: ILiveLocation | null): boolean =>
    this.liveLocationService.compareLiveLocation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sOSButton }) => {
      this.sOSButton = sOSButton;
      if (sOSButton) {
        this.updateForm(sOSButton);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sOSButton = this.sOSButtonFormService.getSOSButton(this.editForm);
    if (sOSButton.id !== null) {
      this.subscribeToSaveResponse(this.sOSButtonService.update(sOSButton));
    } else {
      this.subscribeToSaveResponse(this.sOSButtonService.create(sOSButton));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISOSButton>>): void {
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

  protected updateForm(sOSButton: ISOSButton): void {
    this.sOSButton = sOSButton;
    this.sOSButtonFormService.resetForm(this.editForm, sOSButton);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, sOSButton.user);
    this.liveLocationsCollection = this.liveLocationService.addLiveLocationToCollectionIfMissing<ILiveLocation>(
      this.liveLocationsCollection,
      sOSButton.liveLocation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.sOSButton?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.liveLocationService
      .query({ filter: 'sosbuttons-is-null' })
      .pipe(map((res: HttpResponse<ILiveLocation[]>) => res.body ?? []))
      .pipe(
        map((liveLocations: ILiveLocation[]) =>
          this.liveLocationService.addLiveLocationToCollectionIfMissing<ILiveLocation>(liveLocations, this.sOSButton?.liveLocation)
        )
      )
      .subscribe((liveLocations: ILiveLocation[]) => (this.liveLocationsCollection = liveLocations));
  }
}
