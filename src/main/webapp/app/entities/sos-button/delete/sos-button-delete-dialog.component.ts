import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISOSButton } from '../sos-button.model';
import { SOSButtonService } from '../service/sos-button.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './sos-button-delete-dialog.component.html',
})
export class SOSButtonDeleteDialogComponent {
  sOSButton?: ISOSButton;

  constructor(protected sOSButtonService: SOSButtonService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sOSButtonService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
