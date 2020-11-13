import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private afs: AngularFirestore) {
  }
    getItems(): Observable<any[]> {
        const ref = this.afs.collection<any>('articles');
        return ref.valueChanges();
    }
    add(obj : any) {
        const newId = Date.now().toString();
        const ref = this.afs.collection<any>('wiki').doc(newId);
        return ref.set(obj);
    }
}
