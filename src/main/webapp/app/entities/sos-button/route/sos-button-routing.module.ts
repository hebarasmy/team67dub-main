import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SOSButtonComponent } from '../list/sos-button.component';
import { SOSButtonDetailComponent } from '../detail/sos-button-detail.component';
import { SOSButtonUpdateComponent } from '../update/sos-button-update.component';
import { SOSButtonRoutingResolveService } from './sos-button-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const sOSButtonRoute: Routes = [
  {
    path: '',
    component: SOSButtonComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SOSButtonDetailComponent,
    resolve: {
      sOSButton: SOSButtonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SOSButtonUpdateComponent,
    resolve: {
      sOSButton: SOSButtonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SOSButtonUpdateComponent,
    resolve: {
      sOSButton: SOSButtonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sOSButtonRoute)],
  exports: [RouterModule],
})
export class SOSButtonRoutingModule {}
