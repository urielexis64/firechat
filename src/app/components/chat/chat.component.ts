import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [],
})
export class ChatComponent implements OnInit {
  message: string;
  element: any;

  constructor(public _cs: ChatService) {
    _cs.loadMessages().subscribe(() => {
      setTimeout(() => {
        this.element.scrollTop = this.element.scrollHeight;
      }, 20);
    });
  }
  ngOnInit(): void {
    this.element = document.getElementById('app-messages');
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
