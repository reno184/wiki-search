import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {Params} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class WikiService {

    constructor(private afs: AngularFirestore) {
    }

    getItem(id: string): Observable<any> {
        const ref = this.afs.collection<any>('wiki').doc(id);
        return ref.valueChanges();
    }

    getItems(): Observable<any[]> {
        const ref = this.afs.collection<any>('wiki');
        return ref.valueChanges();
    }

    upsert(params: Params, obj: any) {
       console.log(params, obj);
        const id = params['wiki-id'] || Date.now().toString();
        const ref = this.afs.collection<any>('wiki').doc(id);
        return params['wiki-id'] ?  ref.update(obj) : ref.set(obj)
    }

    delete(id: string) {
        const ref = this.afs.collection<any>('wiki').doc(id);
        return ref.delete();
    }
}
