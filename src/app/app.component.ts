import {Component, OnInit} from '@angular/core';
import {MessageEventDto, MessagesService} from "./service/messages.service";

export enum MESSAGES_EVENTS {
  CREATE = 'messages.create',
  UPDATE = 'messages.update',
  DELETE = 'messages.delete',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kafka-messages-web-app';
  readonly anonymousAvatar = 'https://icons.iconarchive.com/icons/custom-icon-design/pretty-office-2/128/FAQ-icon.png';
  readonly avatars = new Map()
    .set('Avenger', 'https://icons.iconarchive.com/icons/hopstarter/superhero-avatar/128/Avengers-Nick-Fury-icon.png')
    .set('Warrior', 'https://icons.iconarchive.com/icons/martz90/hex/128/game-eternity-warriors-2-icon.png')
    .set('Mario', 'https://icons.iconarchive.com/icons/yellowicon/game-stars/128/Mario-icon.png')
    .set('Barracuda', 'https://icons.iconarchive.com/icons/iconshock/a-team/128/mario-icon.png')
    .set('Foot16', 'https://icons.iconarchive.com/icons/icons-land/vista-people/128/Sport-Football-Player-Male-Light-icon.png');
  messages: MessageEventDto[] = [];

  constructor(private messagesService: MessagesService) {
  }

  ngOnInit(): void {

    this.messagesService.receiveEvent(MESSAGES_EVENTS.CREATE).subscribe((message: MessageEventDto) => {
      console.log({msg: "Received event message", type: MESSAGES_EVENTS.CREATE, message})
      message.time = new Date(message.time);
      const index = this.messages.findIndex(m => m.pseudo == message.pseudo);
      if (index >= 0) {
        this.messages[index] = message;
      } else {
        this.messages.push(message);
      }
      this.messages.sort((a, b) => b.id - a.id);
    });

    this.messagesService.receiveEvent(MESSAGES_EVENTS.UPDATE).subscribe(message => {
      console.log({msg: "Received event message", type: MESSAGES_EVENTS.UPDATE, message})
      for (const m of this.messages) {
        if (m.id == message.id) {
          m.content = message.content;
          m.time = new Date(message.time);
          break;
        }
      }
    });

    this.messagesService.receiveEvent(MESSAGES_EVENTS.DELETE).subscribe(data => {
      console.log({msg: "Received event message", type: MESSAGES_EVENTS.DELETE, data})
      for (const m of this.messages) {
        if (m.id == data.messageId) {
          m.content = 'Message deleted';
          m.time = new Date();
          m.pseudo = '';
          break;
        }
      }
    });
  }
}
