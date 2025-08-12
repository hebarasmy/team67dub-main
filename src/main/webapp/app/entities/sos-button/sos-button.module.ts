import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SOSButtonComponent } from './list/sos-button.component';
import { SOSButtonDetailComponent } from './detail/sos-button-detail.component';
import { SOSButtonUpdateComponent } from './update/sos-button-update.component';
import { SOSButtonDeleteDialogComponent } from './delete/sos-button-delete-dialog.component';
import { SOSButtonRoutingModule } from './route/sos-button-routing.module';

@NgModule({
  imports: [SharedModule, SOSButtonRoutingModule],
  declarations: [SOSButtonComponent, SOSButtonDetailComponent, SOSButtonUpdateComponent, SOSButtonDeleteDialogComponent],
})
export class SOSButtonModule {}
