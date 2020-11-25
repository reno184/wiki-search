import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {filter, finalize, mergeMap} from "rxjs/operators";
import {WikiService} from "../../../shared/wiki.service";
import {AngularFireStorage} from "@angular/fire/storage";

@Component({
    selector: 'app-inspiration',
    template: `

        <ng-container *ngIf="params$ | async as params">
            <form [formGroup]="formGroup" (submit)="onSave(params)" class="m-3">
                <!-- lien description -->
                <div class="form-group">
                    <textarea class="form-control" formControlName="desc" rows="2"
                              placeholder="Nouvelle description"></textarea>
                </div>
                <!-- lien optionnel -->
                <div class="form-group">
                    <input id="iLink" type="url" formControlName="extlink" placeholder="Lien (optionnel)"
                           class="form-control">
                </div>
                <!-- favoris -->
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" formControlName="favoris" id="iFav">
                    <label class="form-check-label" for="iFav">
                        Favoris
                    </label>
                </div>
                <!-- category -->
                <select class="custom-select mb-3" formControlName="domaine">
                    <option value="pro">Pro</option>
                    <option value="perso">Perso</option>
                </select>
                <!-- category -->
                <select class="custom-select mb-3" formControlName="category">
                    <option value="favoris">Favoris</option>
                    <option value="inspiration">Inspiration</option>
                    <option value="outil">Outil</option>
                    <option value="lecture">Lecture</option>
                </select>
                <!-- lien image -->
                <input type="hidden" formControlName="imgurl">
                <input type="hidden" formControlName="imgpath">
                <div class="custom-file" style="height: 70px">
                    <input type="file" class="custom-file-input" id="i02" (change)="onChange($event)">
                    <label class="custom-file-label" for="i02">{{formGroup.get('imgpath').value}}</label>
                    <ng-container *ngIf="uploadPercent$ | async as uploadPercent">
                        <div class="progress" style="width: 30%;height: 5px;margin-top: 5px">
                            <div id="progress" class="progress-bar  bg-primary" role="progressbar"
                                 [ngStyle]="{ 'width' :  uploadPercent +'%' }" style="width: 0;" aria-valuenow="0"
                                 aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </ng-container>
                </div>

                <!-- footer -->
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
export class LinkComponent implements OnInit {
    formGroup: FormGroup;
    params$: Observable<Params>;
    uploadPercent$: Observable<number>;

    constructor(private formBuilder: FormBuilder, private storage: AngularFireStorage, private wikiService: WikiService, private router: Router, private  activatedRoute: ActivatedRoute) {
        this.formGroup = this.formBuilder.group({
            category: ['favoris', Validators.required],
            domaine: ['pro', Validators.required],
            desc: ['', Validators.required],
            imgurl: [''],
            imgpath: [''],
            extlink: [''],
            favoris: [true]
        })

        this.params$ = this.activatedRoute.queryParams;

        this.params$.pipe(
            filter(params => !!params['item-id']),
            mergeMap(params => this.wikiService.getItem('link', params['item-id']))).subscribe(item => {

            this.formGroup.patchValue({
                desc: item.desc,
                domaine: item.domaine,
                imgurl: item.imgurl,
                content: item.content,
                category: item.category,
                imgpath: item.imgpath,
                extlink: item.extlink,
                favoris: item.favoris
            })
        });
    }

    ngOnInit(): void {
    }

    onSave(params: Params) {
        this.wikiService.upsert('link', {
            desc: this.formGroup.get('desc').value || '',
            imgurl: this.formGroup.get('imgurl').value || '',
            imgpath: this.formGroup.get('imgpath').value || '',
            extlink: this.formGroup.get('extlink').value || '',
            category: this.formGroup.get('category').value || 'favoris',
            domaine: this.formGroup.get('domaine').value || 'pro',
            favoris: this.formGroup.get('favoris').value || false
        }, params['item-id']).then(() => {
            this.router.navigate(['/', {outlets: {modal: null}}], {
                queryParamsHandling: 'merge',
                queryParams: {'modal-type': null, 'item-id': null}
            })
        })
    }


    onChange($event: any) {
        const file = $event.target.files[0]
        const newUrl = 'img_' + Date.now();
        const fileRef = this.storage.ref('link/' + newUrl);
        const task = fileRef.put(file);
        this.uploadPercent$ = task.percentageChanges();
        task.snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL().toPromise().then(value => {
                this.formGroup.get('imgurl').patchValue(value);
                this.formGroup.get('imgpath').patchValue(newUrl);
            }))
        ).subscribe()
    }
}
