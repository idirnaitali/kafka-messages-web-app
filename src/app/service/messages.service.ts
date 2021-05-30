import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';

export interface MessageEventDto {
  id: number;
  pseudo: string;
  content: string;
  time: Date
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private readonly socket: Socket) {
  }

  receiveEvent(eventId: string): Observable<any> {
    console.warn('Subscribing to event id: ', eventId)
    return this.socket.fromEvent(eventId);
  }
}
