import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
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
        <div class="mt-4 mb-3">
            <a [routerLink]="['/', { outlets: { modal: 'modal/modal-wiki' }}]"
               queryParamsHandling="preserve"
               class="btn btn-primary mr-1"><i class="far fa-plus-circle mr-1"></i>Nouveau</a>

        </div>
        <ng-container *ngIf="params$ | async as params">
            <ais-instantsearch [config]="config">
                <ais-configure [searchParameters]="{ hitsPerPage: 3 }"></ais-configure>
                <ais-search-box></ais-search-box>
                <ais-hits>
                    <ng-template let-hits="hits">
                        <div class="card-group my-3">
                            <div *ngFor="let hit of hits" class="card mx-1">
                                <div class="card-body">

                                    <div class="card-title">
                                        <ais-highlight attribute="desc" [hit]="hit"></ais-highlight>
                                    </div>

                                    <div [innerHTML]="hit.content" class="card-text"></div>
                                    <footer class="my-3 text-right bg-light p-1 rounded">
                                        <a *ngIf="hit.content !==''" routerLink="../wiki-detail"
                                           [queryParams]="{ 'item-id' : hit.objectID }" queryParamsHandling="merge"
                                           class="mr-1">Détail |</a>
                                        <a *ngIf="hit.url !=='' " href="{{hit.url}}" class="mr-1" target="_blank"
                                           title="{{hit.url}}">Lien |</a>

                                        <a [routerLink]="['/', { outlets: { modal: 'modal/modal-wiki'}}]"
                                           queryParamsHandling="merge"
                                           [queryParams]="{ 'item-id' : hit.objectID }"
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
            </ais-instantsearch>

        </ng-container>
    `,
    styles: []
})
export class WikiListComponent implements OnInit {
    params$: Observable<Params>
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
        this.articleService.delete(params['item-type'], id)
    }

}
