import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PoliceStationComponent } from './list/police-station.component';
import { PoliceStationDetailComponent } from './detail/police-station-detail.component';
import { PoliceStationUpdateComponent } from './update/police-station-update.component';
import { PoliceStationDeleteDialogComponent } from './delete/police-station-delete-dialog.component';
import { PoliceStationRoutingModule } from './route/police-station-routing.module';

@NgModule({
  imports: [SharedModule, PoliceStationRoutingModule],
  declarations: [PoliceStationComponent, PoliceStationDetailComponent, PoliceStationUpdateComponent, PoliceStationDeleteDialogComponent],
})
export class PoliceStationModule {}
