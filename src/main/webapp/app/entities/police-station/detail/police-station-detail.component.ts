import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPoliceStation } from '../police-station.model';

@Component({
  selector: 'jhi-police-station-detail',
  templateUrl: './police-station-detail.component.html',
})
export class PoliceStationDetailComponent implements OnInit {
  policeStation: IPoliceStation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ policeStation }) => {
      this.policeStation = policeStation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
