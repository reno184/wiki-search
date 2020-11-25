import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {filter, finalize, mergeMap, startWith, tap} from "rxjs/operators";
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
               <!-- category -->
                <select class="custom-select" formControlName="category">
                    <option value="favoris">Favoris</option>
                    <option value="inspiration">Inspiration</option>
                    <option value="outil">Outil</option>
                    <option value="lecture">Lecture</option>
                </select>
                <!-- lien optionnel -->
                <div class="form-group">
                    <input type="link" formControlName="extlink" class="form-control">
                </div>
                <!-- lien image -->
                <input type="hidden" class="form-control" formControlName="imgurl">
                <input type="hidden" class="form-control" formControlName="imgpath">
                <div class="custom-file mt-2" style="height: 70px">
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
            category: ['ecran', Validators.required],
            desc: ['', Validators.required],
            content : '',
            imgurl: [''],
            imgpath: [''],
            extlink: ['']
        })

        this.params$ = this.activatedRoute.queryParams;

        this.params$.pipe(
            filter(params => !!params['item-id']),
            mergeMap(params => this.wikiService.getItem(params['item-type'], params['item-id']))).subscribe(item => {
            this.formGroup.patchValue({
                desc: item.desc,
                imgurl: item.imgurl,
                content : item.content,
                category : item.category,
                imgpath: item.imgpath,
                extlink : item.extlink
            })
        });
    }

    ngOnInit(): void {
    }

    onSave(params: Params) {
         this.wikiService.upsert(params['item-type'], params['item-id'], {
             desc: this.formGroup.get('desc').value  || '',
             imgurl: this.formGroup.get('imgurl').value|| '',
             imgpath: this.formGroup.get('imgpath').value|| '',
             extlink: this.formGroup.get('extlink').value|| '',
             category : this.formGroup.get('category').value,
         }).then(() => {
             this.router.navigate(['/', {outlets: {modal: null}}], {
                 queryParamsHandling: 'merge',
                 queryParams: {'modal-type': null, 'item-id': null}
             })
         })
    }


    onChange($event: any) {
        const file = $event.target.files[0]
        const fileRef = this.storage.ref('link/' + file.name);
        const task = fileRef.put(file);
        this.uploadPercent$ = task.percentageChanges();
        task.snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL().toPromise().then(value => {
                this.formGroup.get('imgurl').patchValue(value);
                this.formGroup.get('imgpath').patchValue('img_'+Date.now());
            }))
        ).subscribe()
    }
}
