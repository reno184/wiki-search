import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {Router} from "@angular/router";
import {WikiService} from "../../../shared/wiki.service";
import {Observable} from "rxjs";
import * as algoliasearch from "algoliasearch/lite";
const searchClient = algoliasearch(
    'TJ513YQXZZ',
    '64d5ea3b5a1670c0d600e6ba8d2ce033'
);

@Component({
  selector: 'app-article-list',
  template: `
    <div class="container">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark rounded mt-2">
            <div class="navbar-brand">
                <img src="../../../../assets/img/favicon-32x32.png" alt="logo" width="32">
            </div>
            <ul class="navbar-nav mr-auto ">
            </ul>
            <div class="badge badge-light p-2 badge-pill">
                <a (click)="onSignOut()" role="button" title="Déconnexion" >
                    <i class="far fa-lock-open"></i>
                </a>
            </div>
        </nav>
        <div class="shadow-sm border border-dark bg-white my-3">
            <a routerLink="../article-detail">Nouveau</a>
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
                                        <div [innerHTML]="hit.content" class="card-text" ></div>
                                    <div class="text-right">
                                    <a routerLink="../article-detail" [queryParams]="{ 'wiki-id' : hit.id }" class="mr-1">Voir</a>
                                    <a role="button" (click)="onDelete(hit.objectID)">Delete</a>
                                    </div>
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
    config = {
        indexName: 'wiki',
        searchClient
    };
  constructor( private authService: AuthService, private router : Router, private articleService: WikiService) {
      this.articles$ = this.articleService.getItems();

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
}
