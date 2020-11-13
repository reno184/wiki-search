import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WikiService {

  constructor(private afs: AngularFirestore) {
  }
    getItem(id :string): Observable<any> {
        const ref = this.afs.collection<any>('wiki').doc(id);
        return ref.valueChanges();
    }
    getItems(): Observable<any[]> {
        const ref = this.afs.collection<any>('wiki');
        return ref.valueChanges();
    }
    add(obj : any) {
        const id = Date.now().toString();
        const ref = this.afs.collection<any>('wiki').doc(id);
        return ref.set(Object.assign(obj, { id  }));
    }
    update(id : string, obj : any) {
      console.info('ren',id)
        const ref = this.afs.collection<any>('wiki').doc(id);
        return ref.update(obj);
    }
    delete(id : string) {
        const ref = this.afs.collection<any>('wiki').doc(id);
        return ref.delete();
    }
}
