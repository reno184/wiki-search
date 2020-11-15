import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs";
import {mergeMap} from "rxjs/operators";
import {WikiService} from "../../../shared/wiki.service";

@Component({
    selector: 'app-simple-list',
    template: `
            <div class="mt-4 mb-3">
                <a [routerLink]="['/', { outlets: { modal: 'modal/modal-url' }}]" class="btn btn-primary"
                   [queryParams]="{ 'modal-type' : 'modal-url'}" queryParamsHandling="merge"
                ><i class="far fa-plus-circle mr-1"></i>Nouveau</a>
            </div>

        <ng-container *ngIf="$params | async as params">
                <ng-container *ngIf="$items | async as items">
                    <div class="list-group my-3">
                        <li class="list-group-item d-flex" *ngFor="let item of items">
                            <div class="d-flex flex-column flex-grow-1">
                               {{item.desc}} 
                                <a href="{{item.url}}" target="_blank" title="{{item.desc}}"><small>{{item.url}}</small></a>
                            </div>
                            <div>
                                <a [routerLink]="['/', { outlets: { modal: 'modal/modal-url' }}]"
                                   [queryParams]="{ 'modal-type' : 'modal-url', 'item-id' : item.id }" queryParamsHandling="merge"
                                   class="mr-1" ><i class="far fa-pen"></i></a>
                                <a (click)="onDelete(params, item.id)"  ><i class="far fa-minus-circle"></i></a>
                            </div>
                        </li>
                    </div>
                </ng-container>
        </ng-container>
    `,
    styles: []
})
export class SimpleListComponent implements OnInit {
    $params: Observable<Params>;
    $items: Observable<any[]>

    constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private wikiService: WikiService) {
        this.$params = this.activatedRoute.queryParams;
        this.$items = this.$params.pipe(mergeMap(params => this.wikiService.getItems(params['item-type'])))
    }

    ngOnInit(): void {
    }

    onDelete(params: Params, id: string) {
        this.wikiService.delete(params['item-type'], id);
    }
}
