import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {Params} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/storage";

@Injectable({
    providedIn: 'root'
})
export class WikiService {

    constructor(private afs: AngularFirestore, private af: AngularFireStorage) {
    }

    getItem(type :string, id: string): Observable<any> {
        const ref = this.afs.collection<any>(type).doc(id);
        return ref.valueChanges();
    }

    getItems(type:string): Observable<any[]> {
        const ref = this.afs.collection<any>(type);
        return ref.valueChanges();
    }

    upsert(type :string, id: string, obj: any) {
        const ref = this.afs.collection<any>(type);
        if(id){
            return   ref.doc(id).update(Object.assign(obj,{id}))
        }else{
            const newid =  Date.now().toString();
            return  ref.doc(newid).set(Object.assign(obj,{id  : newid}))
        }
    }

    delete(type :string, id: string) {
        const ref = this.afs.collection<any>(type).doc(id);
        return ref.delete();
    }


}
