import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {combineLatest, Observable} from "rxjs";
import {map, mergeMap, startWith} from "rxjs/operators";
import {WikiService} from "../../../shared/wiki.service";
import {FormControl} from "@angular/forms";

@Component({
    selector: 'app-inspiration-list',
    template: `
        <div class="mt-4 mb-3">
            <a [routerLink]="['/', { outlets: { modal: 'modal/modal-inspiration' }}]"
               queryParamsHandling="preserve"
               class="btn btn-primary"><i class="far fa-plus-circle mr-1"></i>Nouvelle</a>
            <select class="custom-select ml-1" [formControl]="filtre" style="width: 300px">
                <option value="ecran">Ecran</option>
                <option value="composant">Composant</option>
                <option value="divers">Divers</option>
            </select>
          
        </div>
        <ng-container *ngIf="$params | async as params">
      
                
              
                <div class="card-columns mt-3" *ngIf="$items | async as items">
                    <div *ngFor="let item of items" class="card">
                        <img src="{{item.url}}" alt="item.desc" class="card-img-top">
                        <div class="card-body">
                            {{item.desc}}
                        </div>
                        <div class="card-footer">
                            <a href="{{item.url}}" target="_blank" title="Voir image">Voir |</a>
                            <a [routerLink]="['/', { outlets: { modal: 'modal/modal-inspiration' }}]"
                               [queryParams]="{  'item-id' : item.id }" queryParamsHandling="merge"
                               class="mr-1"> Modifier |</a>
                            <a (click)="onDelete(params, item.id)" role="button"> Supprimer</a>
                        </div>
                    </div>
                </div>
            
        </ng-container>
    `,
    styles: []
})
export class InspirationListComponent implements OnInit {
    $params: Observable<Params>;
    $items: Observable<any[]>;
    filtre = new FormControl('ecran');

    constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private wikiService: WikiService) {
        this.$params = this.activatedRoute.queryParams;

        const $temp = this.$params.pipe(mergeMap(params => this.wikiService.getItems(params['item-type'])))
        const filtre$ = this.filtre.valueChanges.pipe(startWith('ecran'));

        this.$items = combineLatest($temp,filtre$).pipe(map(([items,filtre]) => {
            return items.filter(state => {
                return state.category.toLowerCase().indexOf(filtre.toLowerCase()) !== -1
            })
        }));
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
