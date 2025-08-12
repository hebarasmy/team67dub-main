import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DangerZoneComponent } from './list/danger-zone.component';
import { DangerZoneDetailComponent } from './detail/danger-zone-detail.component';
import { DangerZoneUpdateComponent } from './update/danger-zone-update.component';
import { DangerZoneDeleteDialogComponent } from './delete/danger-zone-delete-dialog.component';
import { DangerZoneRoutingModule } from './route/danger-zone-routing.module';

@NgModule({
  imports: [SharedModule, DangerZoneRoutingModule],
  declarations: [DangerZoneComponent, DangerZoneDetailComponent, DangerZoneUpdateComponent, DangerZoneDeleteDialogComponent],
})
export class DangerZoneModule {}
