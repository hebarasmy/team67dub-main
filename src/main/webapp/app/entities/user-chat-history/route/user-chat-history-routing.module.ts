import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserChatHistoryComponent } from '../list/user-chat-history.component';
import { UserChatHistoryDetailComponent } from '../detail/user-chat-history-detail.component';
import { UserChatHistoryUpdateComponent } from '../update/user-chat-history-update.component';
import { UserChatHistoryRoutingResolveService } from './user-chat-history-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userChatHistoryRoute: Routes = [
  {
    path: '',
    component: UserChatHistoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserChatHistoryDetailComponent,
    resolve: {
      userChatHistory: UserChatHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserChatHistoryUpdateComponent,
    resolve: {
      userChatHistory: UserChatHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserChatHistoryUpdateComponent,
    resolve: {
      userChatHistory: UserChatHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userChatHistoryRoute)],
  exports: [RouterModule],
})
export class UserChatHistoryRoutingModule {}
