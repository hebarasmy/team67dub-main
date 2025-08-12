import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDangerZone } from '../danger-zone.model';
import { DangerZoneService } from '../service/danger-zone.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './danger-zone-delete-dialog.component.html',
})
export class DangerZoneDeleteDialogComponent {
  dangerZone?: IDangerZone;

  constructor(protected dangerZoneService: DangerZoneService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dangerZoneService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
