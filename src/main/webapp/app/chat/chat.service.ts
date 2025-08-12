// import { Injectable } from '@angular/core';
// import * as SockJS from 'sockjs-client';
// import * as Stomp from 'stompjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ChatService {
//   socket = new SockJS('');
//   stompClient = Stomp.over(this.socket);

//   subscribe(topic: string, callBack: any): void {
//     const connected: boolean = this.stompClient.connected;
//     if (connected) {
//       console.log('connected');
//       return;
//     }

//     // If stomp client is not connected connect and subscribe to topic
//     this.stompClient.connect({}, (): any => {
//       this.subscribeToTopic(topic, callBack);
//     });
//   }

//   subscribeToTopic(topic: string, callback: any): void {
//     this.stompClient.subscribe(topic, () => {
//       callback();
//     });
//   }
// }
