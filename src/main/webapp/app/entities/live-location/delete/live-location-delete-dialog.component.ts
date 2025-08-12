import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILiveLocation } from '../live-location.model';
import { LiveLocationService } from '../service/live-location.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './live-location-delete-dialog.component.html',
})
export class LiveLocationDeleteDialogComponent {
  liveLocation?: ILiveLocation;

  constructor(protected liveLocationService: LiveLocationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.liveLocationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
