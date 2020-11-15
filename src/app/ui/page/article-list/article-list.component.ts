import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {WikiService} from "../../../shared/wiki.service";
import {Observable} from "rxjs";
import * as algoliasearch from "algoliasearch/lite";
import {filter, map, mergeMap} from "rxjs/operators";

const searchClient = algoliasearch(
    'TJ513YQXZZ',
    '64d5ea3b5a1670c0d600e6ba8d2ce033'
);

@Component({
    selector: 'app-article-list',
    template: ` 
            <ng-container *ngIf="params$ | async as params">
        <div class="container">
            <nav class="navbar navbar-expand-lg navbar-light bg-light rounded my-2">
                <div class="navbar-brand">
                    <img src="../../../../assets/img/favicon-32x32.png" alt="logo" width="32">
                    Wiki...
                </div>
                <ul class="navbar-nav mr-auto ">
                    <li class="nav-item">
                        <a [routerLink]="['/', { outlets: { modal: 'modal/modal-url' }}]"
                           [queryParams]="{ 'modal-type' : 'modal-url', 'item-type' : 'wiki'}"
                           class="nav-link"><i class="far fa-plus-circle mr-1"></i>Lien</a>
                    </li>
                    <li class="nav-item">
                        <a [routerLink]="['/', { outlets: { modal: 'modal/modal-url' }}]"
                           [queryParams]="{ 'modal-type' : 'modal-code', 'item-type' : 'wiki'}"
                           class="nav-link"><i class="far fa-plus-circle mr-1"></i>Code</a>
                    </li>
                </ul>
                <div class="badge badge-primary p-2 badge-pill mr-1">
                    <a routerLink="/"  class="text-white" title="Menu">
                        <i class="far fa-home"></i>
                    </a>
                </div>
                <div class="badge badge-primary p-2 badge-pill">
                    <a (click)="onSignOut()" role="button" class="text-white" title="Déconnexion">
                        <i class="far fa-lock-open"></i>
                    </a>
                </div>
            </nav>
            <ais-instantsearch [config]="config">
                <ais-configure [searchParameters]="{ hitsPerPage: 3 }"></ais-configure>
                <div>
                    <ais-search-box></ais-search-box>
                    <ais-hits>
                        <ng-template let-hits="hits">
                            <div class="card-group my-3">
                                <div *ngFor="let hit of hits" class="card mx-1">
                                    <div class="card-body">

                                        <div class="card-title">
                                            <ais-highlight attribute="desc" [hit]="hit"></ais-highlight>
                                        </div>
                                        <a href="{{hit.url}}" target="_blank" title="{{hit.desc}}">{{hit.url}}</a>
                                        <div [innerHTML]="hit.content" class="card-text"></div>
                                        <footer class="my-3 text-right bg-light p-1 rounded">
                                            <a *ngIf="hit.content !=''" routerLink="../new-item"
                                               [queryParams]="{ 'item-id' : hit.objectID }" queryParamsHandling="preserve"
                                               class="mr-1">Détail |</a>
                                            <a [routerLink]="['/', { outlets: { modal: 'modal/modal-url'}}]" queryParamsHandling="merge"
                                               [queryParams]="{ 'item-id' : hit.objectID, 'modal-type' :  (hit.url ? 'modal-url' : 'modal-code') }"
                                               class="mr-1">Modifier |</a>
                                            <a role="button" (click)="onDelete(params, hit.objectID)">Delete</a>
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
            </ng-container> 
    `,
    styles: []
})
export class ArticleListComponent implements OnInit {
    params$ : Observable<Params>
    config = {
        indexName: 'wiki',
        searchClient
    };
    constructor(private authService: AuthService, private router: Router, private articleService: WikiService, private activatedRoute: ActivatedRoute) {
        this.params$ = this.activatedRoute.queryParams;
    }
    ngOnInit(): void {
    }

    onSignOut() {
        this.authService.logoff();
        this.router.navigateByUrl('/')
    }

    onDelete(params, id) {
        this.articleService.delete(params['item-type'],id)
    }

}
