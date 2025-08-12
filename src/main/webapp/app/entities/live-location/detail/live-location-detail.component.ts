import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILiveLocation } from '../live-location.model';

@Component({
  selector: 'jhi-live-location-detail',
  templateUrl: './live-location-detail.component.html',
})
export class LiveLocationDetailComponent implements OnInit {
  liveLocation: ILiveLocation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ liveLocation }) => {
      this.liveLocation = liveLocation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
