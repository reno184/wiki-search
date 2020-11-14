import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {WikiService} from "../../../shared/wiki.service";
import {Observable} from "rxjs";
import * as algoliasearch from "algoliasearch/lite";
import {filter, map} from "rxjs/operators";
const searchClient = algoliasearch(
    'TJ513YQXZZ',
    '64d5ea3b5a1670c0d600e6ba8d2ce033'
);

@Component({
  selector: 'app-article-list',
  template: `
    <div class="container">
        <nav class="navbar navbar-expand-lg navbar-light bg-light rounded mt-2">
            <div class="navbar-brand">
                <img src="../../../../assets/img/favicon-32x32.png" alt="logo" width="32">
            </div>
            <ul class="navbar-nav mr-auto ">
                <li class="nav-item">
                    <a  [routerLink]="['/', { outlets: { modal: 'modal/new-url' }}]" [queryParams]="{ 'wiki-type' : 'wiki-url'}"
                       class="nav-link"><i class="far fa-plus-circle mr-1"></i>Lien</a>
                </li>
                <li class="nav-item">
                    <a [routerLink]="['/', { outlets: { modal: 'modal/new-url' }}]" [queryParams]="{ 'wiki-type' : 'wiki-code'}"
                       class="nav-link"><i class="far fa-plus-circle mr-1"></i>Code</a>
                </li>
            </ul>
            <div class="badge badge-primary p-2 badge-pill">
                <a (click)="onSignOut()" role="button" class="text-white" title="Déconnexion" >
                    <i class="far fa-lock-open"></i>
                </a>
            </div>
        </nav>
       <div class="my-4 text-center">
          
           <ng-container *ngIf="itemJustAdded$| async as itemJustAdded">
               <a [routerLink]="['../wiki-detail']" queryParamsHandling="merge" [queryParams]="{'wiki-id' : itemJustAdded, 'new-wiki-id' : null}" class="btn btn-primary"><i class="far fa-plus-circle mr-1"></i>Terminer</a>
           </ng-container>
       </div>
     
       
        <ais-instantsearch [config]="config">
            <ais-configure [searchParameters]="{ hitsPerPage: 3 }"></ais-configure>
            <div>
                <ais-search-box></ais-search-box>
                <ais-hits>
                    <ng-template let-hits="hits">
                        <div class="card-group my-3">
                            <div *ngFor="let hit of hits" class="card mx-1" >
                                <div class="card-body">
                                   
                                        <div class="card-title">
                                            <ais-highlight attribute="desc" [hit]="hit"></ais-highlight>
                                        </div>
                                        <a href="{{hit.url}}" target="_blank" title="{{hit.desc}}">{{hit.url}}</a>
                                        <div [innerHTML]="hit.content" class="card-text" ></div>
                                    <footer class="my-3 text-right bg-light p-1 rounded">
                                        <a *ngIf="hit.content !=''" routerLink="../new-item" [queryParams]="{ 'wiki-id' : hit.objectID }" class="mr-1">Détail |</a>
                                    <a [routerLink]="['/', { outlets: { modal: 'modal/new-url'}}]" [queryParams]="{ 'wiki-id' : hit.objectID, 'wiki-type' :  (hit.url ? 'wiki-url' : 'wiki-code') }" class="mr-1">Modifier |</a>
                                    <a role="button" (click)="onDelete(hit.objectID)">Delete</a>
                                    </footer>
                                </div>
                                <!--div class="hit-name">
                                    <ais-highlight attribute="desc" [hit]="hit"></ais-highlight>
                                </div-->
                            </div>
                        </div>
                    </ng-template>
                </ais-hits>
                <ais-pagination></ais-pagination>
            </div>
        </ais-instantsearch>
    </div>
  `,
  styles: [
  ]
})
export class ArticleListComponent implements OnInit {
  articles$:Observable<any[]>;
  itemJustAdded$:Observable<string>
    config = {
        indexName: 'wiki',
        searchClient
    };
  constructor( private authService: AuthService, private router : Router, private articleService: WikiService, private activatedRoute : ActivatedRoute) {
      this.articles$ = this.articleService.getItems();
 this.itemJustAdded$ = this.activatedRoute.queryParams.pipe(filter(params=> !!params['new-wiki-id']),map(params =>params['new-wiki-id'] ))
  }

  ngOnInit(): void {
  }
    onSignOut() {
        this.authService.logoff();
        this.router.navigateByUrl('/')
    }
    onDelete(id){
      console.log('delete', id)
   this.articleService.delete(id)
    }

    test() {
        this.router.navigate(['../wiki-detail'],  { relativeTo: this.activatedRoute, queryParamsHandling: "preserve"});
       // this.router.navi
    }
}
