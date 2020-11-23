import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SimpleListComponent} from "./ui/page/simple-list/simple-list.component";
import {InspirationListComponent} from "./ui/page/inspiration-list/inspiration-list.component";
import {ArticleListComponent} from "./ui/page/article-list/article-list.component";
import {NewItemComponent} from "./ui/modal/new-item/new-item.component";
import {AngularFireAuthGuard, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {AuthComponent} from "./ui/page/auth/auth.component";
import {ModalComponent} from "./ui/modal/modal.component";
import {NewUrlComponent} from "./ui/modal/new-url/new-url.component";
import {InspirationComponent} from "./ui/modal/inspiration/inspiration.component";
import {PageComponent} from "./ui/page/page/page.component";
import {WikiDetailComponent} from "./ui/page/article-list/wiki-detail.component";


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
      {
          path: 'page',
          component : PageComponent,
          children : [
              {path: 'simple-list', component: SimpleListComponent},
              {path: 'inspiration-list', component: InspirationListComponent},
              {path: 'wiki-list', component: ArticleListComponent},
              {path: 'wiki-detail', component: WikiDetailComponent},
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
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
