import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HospitalFormService, HospitalFormGroup } from './hospital-form.service';
import { IHospital } from '../hospital.model';
import { HospitalService } from '../service/hospital.service';
import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { LiveLocationService } from 'app/entities/live-location/service/live-location.service';
import { Geopoint } from 'app/entities/enumerations/geopoint.model';

@Component({
  selector: 'jhi-hospital-update',
  templateUrl: './hospital-update.component.html',
})
export class HospitalUpdateComponent implements OnInit {
  isSaving = false;
  hospital: IHospital | null = null;
  geopointValues = Object.keys(Geopoint);

  liveLocationsSharedCollection: ILiveLocation[] = [];

  editForm: HospitalFormGroup = this.hospitalFormService.createHospitalFormGroup();

  constructor(
    protected hospitalService: HospitalService,
    protected hospitalFormService: HospitalFormService,
    protected liveLocationService: LiveLocationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLiveLocation = (o1: ILiveLocation | null, o2: ILiveLocation | null): boolean =>
    this.liveLocationService.compareLiveLocation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hospital }) => {
      this.hospital = hospital;
      if (hospital) {
        this.updateForm(hospital);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const hospital = this.hospitalFormService.getHospital(this.editForm);
    if (hospital.id !== null) {
      this.subscribeToSaveResponse(this.hospitalService.update(hospital));
    } else {
      this.subscribeToSaveResponse(this.hospitalService.create(hospital));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHospital>>): void {
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

  protected updateForm(hospital: IHospital): void {
    this.hospital = hospital;
    this.hospitalFormService.resetForm(this.editForm, hospital);

    this.liveLocationsSharedCollection = this.liveLocationService.addLiveLocationToCollectionIfMissing<ILiveLocation>(
      this.liveLocationsSharedCollection,
      hospital.liveLocation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.liveLocationService
      .query()
      .pipe(map((res: HttpResponse<ILiveLocation[]>) => res.body ?? []))
      .pipe(
        map((liveLocations: ILiveLocation[]) =>
          this.liveLocationService.addLiveLocationToCollectionIfMissing<ILiveLocation>(liveLocations, this.hospital?.liveLocation)
        )
      )
      .subscribe((liveLocations: ILiveLocation[]) => (this.liveLocationsSharedCollection = liveLocations));
  }
}
