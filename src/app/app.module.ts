import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {environment} from "../environments/environment";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from "@angular/fire";
import {AngularFireAuthModule} from "@angular/fire/auth";
import { AuthComponent } from './ui/page/auth/auth.component';
import { ArticleListComponent } from './ui/page/article-list/article-list.component';
import { TagListComponent } from './ui/modal/tag-list/tag-list.component';
import {RouterModule} from "@angular/router";
import { ModalComponent } from './ui/modal/modal.component';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import { ArticleDetailComponent } from './ui/page/article-detail/article-detail.component';
import {ReactiveFormsModule} from "@angular/forms";
import {QuillModule} from "ngx-quill";
import {NgAisModule} from "angular-instantsearch";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ArticleListComponent,
    TagListComponent,
    ModalComponent,
    ArticleDetailComponent
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
                  {path: 'article-list', component: ArticleListComponent},
                  {path: 'article-detail', component: ArticleDetailComponent}
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
                          {path: 'tag-list', component: TagListComponent}]
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
