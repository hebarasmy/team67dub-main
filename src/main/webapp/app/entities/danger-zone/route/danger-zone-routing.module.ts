import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DangerZoneComponent } from '../list/danger-zone.component';
import { DangerZoneDetailComponent } from '../detail/danger-zone-detail.component';
import { DangerZoneUpdateComponent } from '../update/danger-zone-update.component';
import { DangerZoneRoutingResolveService } from './danger-zone-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const dangerZoneRoute: Routes = [
  {
    path: '',
    component: DangerZoneComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DangerZoneDetailComponent,
    resolve: {
      dangerZone: DangerZoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DangerZoneUpdateComponent,
    resolve: {
      dangerZone: DangerZoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DangerZoneUpdateComponent,
    resolve: {
      dangerZone: DangerZoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dangerZoneRoute)],
  exports: [RouterModule],
})
export class DangerZoneRoutingModule {}
