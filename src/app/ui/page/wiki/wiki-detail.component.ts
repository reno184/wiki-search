import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {mergeMap} from "rxjs/operators";
import {WikiService} from "../../../shared/wiki.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-wiki-detail',
    template: `
        <ng-container *ngIf="item$ | async as item">
            <h1 class="mt-5 mb-2">{{item.desc}}</h1>
            <p  class="bg bg-light py-1 px-3 rounded" [innerHTML]="item.content"></p>
        </ng-container>
    `,
    styles: []
})
export class WikiDetailComponent implements OnInit {
    item$: Observable<any>;

    constructor(private wikiService: WikiService, private router: Router, private  activatedRoute: ActivatedRoute) {
        this.item$ = this.activatedRoute.queryParams.pipe(mergeMap(params => this.wikiService.getItem(params['item-type'], params['item-id'])));
    }

    ngOnInit(): void {
    }

}
