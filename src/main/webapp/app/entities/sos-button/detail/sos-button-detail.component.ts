import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISOSButton } from '../sos-button.model';

@Component({
  selector: 'jhi-sos-button-detail',
  templateUrl: './sos-button-detail.component.html',
})
export class SOSButtonDetailComponent implements OnInit {
  sOSButton: ISOSButton | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sOSButton }) => {
      this.sOSButton = sOSButton;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
