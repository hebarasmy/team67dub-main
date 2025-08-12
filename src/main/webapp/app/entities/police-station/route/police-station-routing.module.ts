import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PoliceStationComponent } from '../list/police-station.component';
import { PoliceStationDetailComponent } from '../detail/police-station-detail.component';
import { PoliceStationUpdateComponent } from '../update/police-station-update.component';
import { PoliceStationRoutingResolveService } from './police-station-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const policeStationRoute: Routes = [
  {
    path: '',
    component: PoliceStationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PoliceStationDetailComponent,
    resolve: {
      policeStation: PoliceStationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PoliceStationUpdateComponent,
    resolve: {
      policeStation: PoliceStationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PoliceStationUpdateComponent,
    resolve: {
      policeStation: PoliceStationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(policeStationRoute)],
  exports: [RouterModule],
})
export class PoliceStationRoutingModule {}
