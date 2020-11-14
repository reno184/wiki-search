import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WikiService} from "../../../shared/wiki.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs";
import {filter, mergeMap} from "rxjs/operators";

@Component({
    selector: 'app-new-url',
    template: `
        <style>

        </style>
        <ng-container *ngIf="params$ | async as params">


            <form [formGroup]="formGroup" (submit)="onSave(params)" class="m-3">
                <div class="form-group">
                    <textarea class="form-control" formControlName="desc" rows="2"
                              placeholder="Nouvelle description"></textarea>
                </div>
                <div *ngIf="params['wiki-type']=== 'wiki-url'" class="form-group">
                    <input type="url" class="form-control" formControlName="url" placeholder="Nouvelle url">
                </div>
                <div class="form-group" *ngIf="params['wiki-type']=== 'wiki-code'">
                    <quill-editor [modules]="editorConfig" formControlName="content"></quill-editor>
                </div>
                <footer class="d-flex justify-content-around">

                    <a [routerLink]="['/', {outlets: {modal: null}}]" class="btn btn-secondary">Retour</a>
                    <button class="btn btn-primary" type="submit" [disabled]="formGroup.invalid"
                            [innerText]="params['wiki-id'] ? 'Modifier' : 'Ajouter'">
                    </button>
                </footer>
            </form>

        </ng-container>
    `,
    styles: []
})
export class NewUrlComponent implements OnInit {
    formGroup: FormGroup;
    params$: Observable<Params>;

    editorConfig = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code-block'],
            [{'header': 1}, {'header': 2}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
        ]
    };

    constructor(private formBuilder: FormBuilder, private wikiService: WikiService, private router: Router, private  activatedRoute: ActivatedRoute) {

        this.formGroup = this.formBuilder.group({
            desc: ['', Validators.required],
            url: [''],
            content: [''],
        })

        this.params$ = this.activatedRoute.queryParams;

        this.params$.pipe(
            filter(params => !!params['wiki-id']),
            mergeMap(params => this.wikiService.getItem(params['wiki-id']))).subscribe(item => {
            this.formGroup.patchValue({
                desc: item.desc,
                url: item.url,
                content: item.content
            })

        });
    }

    ngOnInit(): void {
    }

    onSave(params: Params) {
        this.wikiService.upsert(params, {
            desc: this.formGroup.get('desc').value,
            url: this.formGroup.get('url').value || '',
            content: this.formGroup.get('content').value || ''
        }).then(()=> {
            this.router.navigate(['/', {outlets: {modal: null}}])
        })
    }
}
