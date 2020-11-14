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

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ArticleListComponent,

    ModalComponent,
    NewItemComponent,
    NewUrlComponent
  ],
  imports: [
    BrowserModule,
      ReactiveFormsModule,
      NgAisModule.forRoot(),
      QuillModule.forRoot(),
        AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      RouterModule.forRoot([
          {
              path: 'page',
              children : [
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
                          { path: 'new-url', component: NewUrlComponent},

                      ]
                  }
              ]
          },
          {path: '', redirectTo: 'auth', pathMatch: 'full'}
      ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
