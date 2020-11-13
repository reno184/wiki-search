import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    user: Observable<any>;

    constructor(private auth: AngularFireAuth, private afs: AngularFirestore) {
        this.user = this.auth.authState
    }

    logoff() {
        this.auth.signOut();
    }

    async loginEmailPassword(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password)
    };
}
