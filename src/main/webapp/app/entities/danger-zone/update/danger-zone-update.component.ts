import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DangerZoneFormService, DangerZoneFormGroup } from './danger-zone-form.service';
import { IDangerZone } from '../danger-zone.model';
import { DangerZoneService } from '../service/danger-zone.service';
import { Geopoint } from 'app/entities/enumerations/geopoint.model';

@Component({
  selector: 'jhi-danger-zone-update',
  templateUrl: './danger-zone-update.component.html',
})
export class DangerZoneUpdateComponent implements OnInit {
  isSaving = false;
  dangerZone: IDangerZone | null = null;
  geopointValues = Object.keys(Geopoint);

  editForm: DangerZoneFormGroup = this.dangerZoneFormService.createDangerZoneFormGroup();

  constructor(
    protected dangerZoneService: DangerZoneService,
    protected dangerZoneFormService: DangerZoneFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dangerZone }) => {
      this.dangerZone = dangerZone;
      if (dangerZone) {
        this.updateForm(dangerZone);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dangerZone = this.dangerZoneFormService.getDangerZone(this.editForm);
    if (dangerZone.id !== null) {
      this.subscribeToSaveResponse(this.dangerZoneService.update(dangerZone));
    } else {
      this.subscribeToSaveResponse(this.dangerZoneService.create(dangerZone));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDangerZone>>): void {
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

  protected updateForm(dangerZone: IDangerZone): void {
    this.dangerZone = dangerZone;
    this.dangerZoneFormService.resetForm(this.editForm, dangerZone);
  }
}
