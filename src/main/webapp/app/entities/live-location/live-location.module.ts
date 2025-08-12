import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LiveLocationComponent } from './list/live-location.component';
import { LiveLocationDetailComponent } from './detail/live-location-detail.component';
import { LiveLocationUpdateComponent } from './update/live-location-update.component';
import { LiveLocationDeleteDialogComponent } from './delete/live-location-delete-dialog.component';
import { LiveLocationRoutingModule } from './route/live-location-routing.module';

@NgModule({
  imports: [SharedModule, LiveLocationRoutingModule],
  declarations: [LiveLocationComponent, LiveLocationDetailComponent, LiveLocationUpdateComponent, LiveLocationDeleteDialogComponent],
})
export class LiveLocationModule {}
