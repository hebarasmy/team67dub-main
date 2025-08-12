import { Route } from '@angular/router';
import { ChatComponent } from './chat.component';

export const CHAT_ROUTE: Route = {
  path: '',
  component: ChatComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
