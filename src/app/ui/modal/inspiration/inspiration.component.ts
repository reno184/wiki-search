import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {filter, finalize, mergeMap, tap} from "rxjs/operators";
import {WikiService} from "../../../shared/wiki.service";
import {AngularFireStorage} from "@angular/fire/storage";

@Component({
    selector: 'app-inspiration',
    template: `
        <ng-container *ngIf="params$ | async as params">
            <form [formGroup]="formGroup" (submit)="onSave(params)" class="m-3">
                <div class="form-group">
                    <textarea class="form-control" formControlName="desc" rows="2"
                              placeholder="Nouvelle description"></textarea>
                </div>
                <select class="custom-select" formControlName="category">
                    <option value="ecran">Ecrans</option>
                    <option value="composant">Composants</option>
                    <option value="divers">Divers</option>
                </select>
                <input type="hidden" class="form-control" formControlName="url">
                <div class="custom-file mt-2" style="height: 70px">
                    <input type="file" class="custom-file-input" id="i02" (change)="onChange($event)">
                    <label class="custom-file-label" for="i02">Choose file</label>
                    <ng-container *ngIf="uploadPercent$ | async as uploadPercent">
                        <div class="progress" style="width: 30%;height: 5px;margin-top: 5px">
                            <div id="progress" class="progress-bar  bg-primary" role="progressbar"
                                 [ngStyle]="{ 'width' :  uploadPercent +'%' }" style="width: 0;" aria-valuenow="0"
                                 aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </ng-container>
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
    uploadPercent$: Observable<number>;
    downloadURL$: Observable<string>;

    constructor(private formBuilder: FormBuilder, private storage: AngularFireStorage, private wikiService: WikiService, private router: Router, private  activatedRoute: ActivatedRoute) {
        this.formGroup = this.formBuilder.group({
            category: ['ecran', Validators.required],
            desc: ['', Validators.required],
            url: ['', Validators.required]
        })

        this.params$ = this.activatedRoute.queryParams;

        this.params$.pipe(
            filter(params => !!params['item-id']),
            mergeMap(params => this.wikiService.getItem(params['item-type'], params['item-id']))).subscribe(item => {
            this.formGroup.patchValue({
                desc: item.desc,
                url: item.url,
                category : item.category
            })
        });
    }

    ngOnInit(): void {
    }

    onSave(params: Params) {
         this.wikiService.upsert(params['item-type'], params['item-id'], {
             desc: this.formGroup.get('desc').value,
             url: this.formGroup.get('url').value,
             category : this.formGroup.get('category').value
         }).then(() => {
             this.router.navigate(['/', {outlets: {modal: null}}], {
                 queryParamsHandling: 'merge',
                 queryParams: {'modal-type': null, 'item-id': null}
             })
         })
    }


    onChange($event: any) {
        const file = $event.target.files[0]
        const fileRef = this.storage.ref('inspiration/' + file.name);
        const task = fileRef.put(file);
        this.uploadPercent$ = task.percentageChanges().pipe(tap(x => console.log(x)));
        task.snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL().toPromise().then(value => this.formGroup.get('url').patchValue(value)))
        ).subscribe()
    }
}
