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
      if (user) {
        this.user.name = user.displayName;
        this.user.uid = user.uid;
        this.user.img = user.photoURL;
      }
    });
  }

  login(provider: string) {
    if (provider === 'google') {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else {
      this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }
  }
  logout() {
    this.afAuth.auth.signOut();
    this.user = {};
  }

  loadMessages() {
    this.itemsCollection = this.afs.collection<Message>('chats', (ref) =>
      ref.orderBy('date', 'desc').limit(10)
    );
    return this.itemsCollection.valueChanges().pipe(
      map((messages: Message[]) => {
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
      name: this.user.name,
      message: text,
      img: this.user.img,
      date: new Date().getTime(),
      uid: this.user.uid,
    };

    return this.itemsCollection.add(message);
  }
}
