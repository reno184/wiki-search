import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {environment} from "../environments/environment";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from "@angular/fire";
import {AngularFireAuthModule} from "@angular/fire/auth";
import { AuthComponent } from './ui/page/auth/auth.component';
import { WikiListComponent } from './ui/page/wiki/wiki-list.component';
import {RouterModule} from "@angular/router";
import { ModalComponent } from './ui/modal/modal.component';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {ReactiveFormsModule} from "@angular/forms";
import {QuillModule} from "ngx-quill";
import {NgAisModule} from "angular-instantsearch";
import { WikiComponent } from './ui/modal/wiki/wiki.component';
import { LinkListComponent } from './ui/page/link/link-list.component';
import { PageComponent } from './ui/page/page/page.component';
import { LinkComponent } from './ui/modal/link/link.component';
import {AngularFireStorageModule,BUCKET} from "@angular/fire/storage";
import { WikiDetailComponent } from './ui/page/wiki/wiki-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    WikiListComponent,
    ModalComponent,
    WikiComponent,
    LinkListComponent,
    PageComponent,
    LinkComponent,
    WikiDetailComponent
  ],
  imports: [
    BrowserModule,
      ReactiveFormsModule,
      NgAisModule.forRoot(),
      QuillModule.forRoot(),
        AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      AngularFireStorageModule,
      AppRoutingModule
  ],
    providers: [
        { provide: BUCKET, useValue: 'wiki-crm.appspot.com' }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
