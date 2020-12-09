import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { Message } from '../interfaces/message.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Message>;
  public chats: Message[] = [];
  public user: any = {};

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      console.log(user);

      if (user) {
        this.user.name = user.displayName;
        this.user.uid = user.uid;
      }
    });
  }

  login(provider: string) {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        console.log('Logged successfully');
      });
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  loadMessages() {
    this.itemsCollection = this.afs.collection<Message>('chats', (ref) =>
      ref.orderBy('date', 'desc').limit(5)
    );
    return this.itemsCollection.valueChanges().pipe(
      map((messages: Message[]) => {
        console.log(messages);
        this.chats = [];
        for (let message of messages) {
          this.chats.unshift(message);
        }
        return this.chats;
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
