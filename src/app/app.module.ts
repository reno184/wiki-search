import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {environment} from "../environments/environment";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from "@angular/fire";
import {AngularFireAuthModule} from "@angular/fire/auth";
import { AuthComponent } from './ui/page/auth/auth.component';
import { ArticleListComponent } from './ui/page/article-list/article-list.component';

import {RouterModule} from "@angular/router";
import { ModalComponent } from './ui/modal/modal.component';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {ReactiveFormsModule} from "@angular/forms";
import {QuillModule} from "ngx-quill";
import {NgAisModule} from "angular-instantsearch";
import { NewItemComponent } from './ui/modal/new-item/new-item.component';
import { NewUrlComponent } from './ui/modal/new-url/new-url.component';
import { InspirationListComponent } from './ui/page/inspiration-list/inspiration-list.component';
import { PageComponent } from './ui/page/page/page.component';
import { SimpleListComponent } from './ui/page/simple-list/simple-list.component';
import { InspirationComponent } from './ui/modal/inspiration/inspiration.component';
import {AngularFireStorageModule,BUCKET} from "@angular/fire/storage";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ArticleListComponent,

    ModalComponent,
    NewItemComponent,
    NewUrlComponent,
    InspirationListComponent,
    PageComponent,
    SimpleListComponent,
    InspirationComponent
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
      RouterModule.forRoot([
          {
              path: 'page',
              children : [
                  {path: 'simple-list', component: SimpleListComponent},
                  {path: 'inspiration-list', component: InspirationListComponent},
                  {path: 'wiki-list', component: ArticleListComponent},
                  { path: 'new-item', component: NewItemComponent}
                  ],
              canActivate: [AngularFireAuthGuard], data: {authGuardPipe: () => redirectUnauthorizedTo(['auth'])}
          },
          {
              path: 'auth',
              component: AuthComponent,
          },
          {
              path: 'modal',
              outlet: 'modal', children : [
                  {
                      path: '', component: ModalComponent, children: [
                          { path: 'modal-url', component: NewUrlComponent},
                          { path: 'modal-inspiration', component: InspirationComponent},
                      ]
                  }
              ]
          },
          {path: '', redirectTo: 'auth', pathMatch: 'full'}
      ])
  ],
    providers: [
        { provide: BUCKET, useValue: 'wiki-crm.appspot.com' }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
