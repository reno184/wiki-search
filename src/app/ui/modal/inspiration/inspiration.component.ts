import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {filter, mergeMap} from "rxjs/operators";
import {WikiService} from "../../../shared/wiki.service";

@Component({
    selector: 'app-inspiration',
    template: `
        <ng-container *ngIf="params$ | async as params">
            <form [formGroup]="formGroup" (submit)="onSave(params)" class="m-3">
                <div class="form-group">
                    <textarea class="form-control" formControlName="desc" rows="2"
                              placeholder="Nouvelle description"></textarea>
                </div>
                <div  class="form-group">
                    <input type="url" class="form-control" formControlName="url" placeholder="Nouvelle url">
                </div>
                <footer class="d-flex justify-content-around">
                    <a [routerLink]="['/', {outlets: {modal: null}}]" queryParamsHandling="merge"
                       [queryParams]="{ 'modal-type' : null, 'item-id' : null}" class="btn btn-secondary">Retour</a>
                    <button class="btn btn-primary" type="submit" [disabled]="formGroup.invalid"
                            [innerText]="params['item-id'] ? 'Modifier' : 'Ajouter'">
                    </button>
                </footer>
            </form>
        </ng-container>
    `,
    styles: []
})
export class InspirationComponent implements OnInit {
    formGroup: FormGroup;
    params$: Observable<Params>;

    constructor(private formBuilder: FormBuilder, private wikiService: WikiService, private router: Router, private  activatedRoute: ActivatedRoute) {
        this.formGroup = this.formBuilder.group({
            desc: ['', Validators.required],
            url: ['']
        })

        this.params$ = this.activatedRoute.queryParams;

        this.params$.pipe(
            filter(params => !!params['item-id']),
            mergeMap(params => this.wikiService.getItem(params['item-type'], params['item-id']))).subscribe(item => {
            this.formGroup.patchValue({
                desc: item.desc,
                url: item.url
            })
        });
    }

    ngOnInit(): void {
    }

    onSave(params: Params) {
        this.wikiService.upsert(params['item-type'], params['item-id'], {
            desc: this.formGroup.get('desc').value,
            url: this.formGroup.get('url').value || ''
        }).then(() => {
            this.router.navigate(['/', {outlets: {modal: null}}], {
                queryParamsHandling: 'merge',
                queryParams: {'modal-type': null, 'item-id': null}
            })
        })
    }

}
