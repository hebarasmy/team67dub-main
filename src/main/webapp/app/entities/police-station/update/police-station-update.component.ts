import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PoliceStationFormService, PoliceStationFormGroup } from './police-station-form.service';
import { IPoliceStation } from '../police-station.model';
import { PoliceStationService } from '../service/police-station.service';
import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { LiveLocationService } from 'app/entities/live-location/service/live-location.service';
import { Geopoint } from 'app/entities/enumerations/geopoint.model';

@Component({
  selector: 'jhi-police-station-update',
  templateUrl: './police-station-update.component.html',
})
export class PoliceStationUpdateComponent implements OnInit {
  isSaving = false;
  policeStation: IPoliceStation | null = null;
  geopointValues = Object.keys(Geopoint);

  liveLocationsSharedCollection: ILiveLocation[] = [];

  editForm: PoliceStationFormGroup = this.policeStationFormService.createPoliceStationFormGroup();

  constructor(
    protected policeStationService: PoliceStationService,
    protected policeStationFormService: PoliceStationFormService,
    protected liveLocationService: LiveLocationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLiveLocation = (o1: ILiveLocation | null, o2: ILiveLocation | null): boolean =>
    this.liveLocationService.compareLiveLocation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ policeStation }) => {
      this.policeStation = policeStation;
      if (policeStation) {
        this.updateForm(policeStation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const policeStation = this.policeStationFormService.getPoliceStation(this.editForm);
    if (policeStation.id !== null) {
      this.subscribeToSaveResponse(this.policeStationService.update(policeStation));
    } else {
      this.subscribeToSaveResponse(this.policeStationService.create(policeStation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPoliceStation>>): void {
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

  protected updateForm(policeStation: IPoliceStation): void {
    this.policeStation = policeStation;
    this.policeStationFormService.resetForm(this.editForm, policeStation);

    this.liveLocationsSharedCollection = this.liveLocationService.addLiveLocationToCollectionIfMissing<ILiveLocation>(
      this.liveLocationsSharedCollection,
      policeStation.liveLocation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.liveLocationService
      .query()
      .pipe(map((res: HttpResponse<ILiveLocation[]>) => res.body ?? []))
      .pipe(
        map((liveLocations: ILiveLocation[]) =>
          this.liveLocationService.addLiveLocationToCollectionIfMissing<ILiveLocation>(liveLocations, this.policeStation?.liveLocation)
        )
      )
      .subscribe((liveLocations: ILiveLocation[]) => (this.liveLocationsSharedCollection = liveLocations));
  }
}
