import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDangerZone } from '../danger-zone.model';

@Component({
  selector: 'jhi-danger-zone-detail',
  templateUrl: './danger-zone-detail.component.html',
})
export class DangerZoneDetailComponent implements OnInit {
  dangerZone: IDangerZone | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dangerZone }) => {
      this.dangerZone = dangerZone;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
