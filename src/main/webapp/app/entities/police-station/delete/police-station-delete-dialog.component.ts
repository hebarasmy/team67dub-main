import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPoliceStation } from '../police-station.model';
import { PoliceStationService } from '../service/police-station.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './police-station-delete-dialog.component.html',
})
export class PoliceStationDeleteDialogComponent {
  policeStation?: IPoliceStation;

  constructor(protected policeStationService: PoliceStationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.policeStationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
