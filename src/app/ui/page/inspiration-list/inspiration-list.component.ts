import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs";
import {mergeMap} from "rxjs/operators";
import {WikiService} from "../../../shared/wiki.service";

@Component({
  selector: 'app-inspiration-list',
  template: `
      <ng-container *ngIf="$params | async as params">
      <div class="container">
          <nav class="navbar navbar-expand-lg navbar-light bg-light rounded mt-2">
              <div class="navbar-brand">
                  <img src="../../../../assets/img/favicon-32x32.png" alt="logo" width="32">
                  Inspiration
              </div>
              <ul class="navbar-nav mr-auto ">
                  <li class="nav-item">
                      <a  [routerLink]="['/', { outlets: { modal: 'modal/modal-inspiration' }}]"  queryParamsHandling="preserve"
                          class="nav-link"><i class="far fa-plus-circle mr-1"></i>Nouvelle</a>
                  </li>
              </ul>
              <div class="badge badge-primary p-2 badge-pill mr-1">
                  <a routerLink="/"  class="text-white" title="Menu">
                      <i class="far fa-home"></i>
                  </a>
              </div>
              <div class="badge badge-primary p-2 badge-pill">
                  <a (click)="onSignOut()" role="button" class="text-white" title="Déconnexion" >
                      <i class="far fa-lock-open"></i>
                  </a>
              </div>
          </nav>
          <ng-container *ngIf="$items | async as items">
              <div class="list-group my-3">
                  <li class="list-group-item d-flex" *ngFor="let item of items">
                      <div class="d-flex flex-column flex-grow-1">
                          {{item.desc}}
                          <a href="{{item.url}}" target="_blank" title="{{item.desc}}"><small>{{item.url}}</small></a>
                      </div>
                      <div>
                          <a [routerLink]="['/', { outlets: { modal: 'modal/modal-url' }}]"
                             [queryParams]="{ 'modal-type' : 'modal-inspiration', 'item-id' : item.id }" queryParamsHandling="merge"
                             class="mr-1" ><i class="far fa-pen"></i></a>
                          <a (click)="onDelete(params, item.id)"  ><i class="far fa-minus-circle"></i></a>
                      </div>
                  </li>
              </div>
          </ng-container>
      </div>
      </ng-container>
  `,
  styles: [
  ]
})
export class InspirationListComponent implements OnInit {
    $params: Observable<Params>;
    $items: Observable<any[]>
  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private wikiService: WikiService) {
      this.$params = this.activatedRoute.queryParams;
      this.$items = this.$params.pipe(mergeMap(params => this.wikiService.getItems(params['item-type'])))
  }

  ngOnInit(): void {
  }
    onSignOut() {
        this.authService.logoff();
        this.router.navigateByUrl('/')
    }
    onDelete(params: Params, id: string) {
        this.wikiService.delete(params['item-type'], id);
    }
}
