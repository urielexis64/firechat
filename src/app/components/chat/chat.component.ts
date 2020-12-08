import { Component } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [],
})
export class ChatComponent {
  message: string;

  constructor(public _cs: ChatService) {
    _cs.loadMessages().subscribe();
  }

  sendMessage() {
    const newMessage = this.message.trim();
    if (newMessage.length !== 0) {
      this._cs
        .addMessage(newMessage)
        .then(() => {
          this.message = '';
          console.log('Message sent!');
        })
        .catch((err) => {
          console.log('Error: ', err);
        });
    }
  }
}
