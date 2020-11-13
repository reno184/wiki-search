import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {Router} from "@angular/router";
import {ArticleService} from "../../../shared/article.service";
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
        <div class="jumbotron shadow-sm border border-dark bg-white my-3">
            <h1>Filtres</h1>
            <a routerLink="../article-detail">Nouveau</a>
        </div>
        <ng-container *ngIf="articles$ | async as articles">
            {{ articles | json}}
        </ng-container>
        <ais-instantsearch [config]="config">
            <ais-configure [searchParameters]="{ hitsPerPage: 3 }"></ais-configure>
            <div class="right-panel">
                <ais-search-box></ais-search-box>
                <ais-hits>
                    <ng-template let-hits="hits">
                        <ol class="ais-Hits-list">
                            <li *ngFor="let hit of hits" >
                                <div class="hit-name">
                                    <ais-highlight attribute="desc" [hit]="hit"></ais-highlight>
                                </div>
                                <div class="hit-description">
                                    <ais-highlight attribute="content" [hit]="hit"></ais-highlight>
                                </div>
                                <div [innerHTML]="hit.content" ></div>
                            </li>
                        </ol>
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
  constructor( private authService: AuthService, private router : Router, private articleService: ArticleService) {
      this.articles$ = this.articleService.getItems();

  }

  ngOnInit(): void {
  }
    onSignOut() {
        this.authService.logoff();
        this.router.navigateByUrl('/')
    }
}
