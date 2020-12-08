import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { Message } from '../interfaces/message.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Message>;
  chats: Message[] = [];
  constructor(private afs: AngularFirestore) {}

  loadMessages() {
    this.itemsCollection = this.afs.collection<Message>('chats');
    return this.itemsCollection.valueChanges().pipe(
      map((messages: Message[]) => {
        console.log(messages);
        this.chats = messages;
      })
    );
  }

  addMessage(text: string) {
    let message: Message = {
      name: 'El Pepe',
      message: text,
      date: new Date().getTime(),
    };

    return this.itemsCollection.add(message);
  }
}
