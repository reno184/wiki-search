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
        <div class="input-group mt-4">
            <div class="input-group-prepend">
                <a [routerLink]="['/', { outlets: { modal: 'modal/modal-link' }}]"
                   class="btn btn-primary"><i class="far fa-plus-circle mr-1"></i>Nouveau</a>
            </div>
            <select class="custom-select" [formControl]="filtreFav">
                <option value="favoris">Favoris</option>
                <option value="inspiration">Inspiration</option>
                <option value="outil">Outil</option>
                <option value="lecture">Lecture</option>
            </select>

        </div>
        <div class="input-group mt-1 mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text"><i class="far fa-search"></i></span>
            </div>
            <input type="text" class="form-control" placeholder="Rechercher..." [formControl]="filtreText">
        </div>

        <div class="card-columns mt-3" *ngIf="$items | async as items">
            <div *ngFor="let item of items" class="card">
                <img *ngIf="item.imgurl !== ''" src="{{item.imgurl}}" alt="{{item.desc}}" class="card-img-top">
                <div class="card-body">
                    {{item.desc}}{{item.imgurl}}
                    <br><small class="badge badge-primary"> {{item.category}}</small>
                    <p *ngIf="item.content !== ''" >{{item.content}}</p>
                </div>
                <div class="card-footer">
                    <a *ngIf="item.url !==''" href="{{item.url}}" target="_blank" title="Voir image">Voir |</a>
                    <a [routerLink]="['/', { outlets: { modal: 'modal/modal-link' }}]"
                       [queryParams]="{  'item-id' : item.id }" class="mr-1"> Modifier |</a>
                    <a (click)="onDelete(item.id)" role="button"> Supprimer</a>
                </div>
            </div>
        </div>


    `,
    styles: []
})
export class LinkListComponent implements OnInit {

    $items: Observable<any[]>;
    filtreFav = new FormControl('favoris');
    filtreText = new FormControl('');
    constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private wikiService: WikiService) {
        const $temp = this.wikiService.getItems('link');
        const filtreFav$ = this.filtreFav.valueChanges.pipe(startWith('lien'));
        const filtreText$ = this.filtreText.valueChanges.pipe(startWith(''));
        this.$items = combineLatest($temp, filtreFav$,filtreText$).pipe(map(([items, filtrefav, filtreText]) => {
            return items.filter(item => {
                return item.category.toLowerCase().indexOf(filtrefav.toLowerCase()) !== -1 && item.desc.toLowerCase().indexOf(filtreText.toLowerCase()) !== -1
            })
        }));
    }

    ngOnInit(): void {
    }

    onSignOut() {
        this.authService.logoff();
        this.router.navigateByUrl('/')
    }

    onDelete(id: string) {
        this.wikiService.delete('link', id);
    }
}
