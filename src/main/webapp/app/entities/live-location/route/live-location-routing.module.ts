import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LiveLocationComponent } from '../list/live-location.component';
import { LiveLocationDetailComponent } from '../detail/live-location-detail.component';
import { LiveLocationUpdateComponent } from '../update/live-location-update.component';
import { LiveLocationRoutingResolveService } from './live-location-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const liveLocationRoute: Routes = [
  {
    path: '',
    component: LiveLocationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LiveLocationDetailComponent,
    resolve: {
      liveLocation: LiveLocationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LiveLocationUpdateComponent,
    resolve: {
      liveLocation: LiveLocationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LiveLocationUpdateComponent,
    resolve: {
      liveLocation: LiveLocationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(liveLocationRoute)],
  exports: [RouterModule],
})
export class LiveLocationRoutingModule {}
