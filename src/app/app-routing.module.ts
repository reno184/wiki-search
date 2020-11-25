import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LinkListComponent} from "./ui/page/link/link-list.component";
import {WikiListComponent} from "./ui/page/wiki/wiki-list.component";
import {AngularFireAuthGuard, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {AuthComponent} from "./ui/page/auth/auth.component";
import {ModalComponent} from "./ui/modal/modal.component";
import {WikiComponent} from "./ui/modal/wiki/wiki.component";
import {LinkComponent} from "./ui/modal/link/link.component";
import {PageComponent} from "./ui/page/page/page.component";
import {WikiDetailComponent} from "./ui/page/wiki/wiki-detail.component";


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
      {
          path: 'page',
          component : PageComponent,
          children : [
              {path: 'link-list', component: LinkListComponent},
              {path: 'wiki-list', component: WikiListComponent},
              {path: 'wiki-detail', component: WikiDetailComponent}
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
                      { path: 'modal-wiki', component: WikiComponent},
                      { path: 'modal-link', component: LinkComponent},
                  ]
              }
          ]
      },
      {path: '', redirectTo: 'auth', pathMatch: 'full'}
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
