import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {WikiService} from "../../../shared/wiki.service";
import {ActivatedRoute, Params} from "@angular/router";
import {filter, mergeMap, tap} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
    selector: 'app-article-detail',
    template: `
        <div class="container" *ngIf="params$ | async as params">
            <div class="card my-3 shadow-sm">
               
                <form class="card-body" [formGroup]="form" (ngSubmit)="onSubmit(params)">
                    <div class="form-group">
                        <label for="iDesc">Description</label>
                        <input type="text"  formControlName="desc" class="form-control" id="iDesc">
                        <small id="emailHelp" class="form-text text-muted">Mettre un trait d'union pour lier deux mots</small>
                    </div>
                    <div class="form-group">
                        <label>Content</label>
                        <quill-editor [style]="editorStyle" [modules]="editorConfig" formControlName="content"></quill-editor>
                    </div>
                   
                    <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1">
                        <label class="form-check-label" for="exampleCheck1">Check me out</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    `,
    styles: [

    ]

})
export class ArticleDetailComponent implements OnInit {
    form: FormGroup;
    params$ : Observable<Params>
    editorStyle = {
        height : '300px'
    }
    editorConfig = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ]
    }

    constructor(public authService: AuthService,private activatedRoute : ActivatedRoute, private formBuilder: FormBuilder, private wikiService : WikiService) {

        this.form = this.formBuilder.group({
            'desc' : this.formBuilder.control(null),
            'content':  this.formBuilder.control(null)
        });

        this.params$ = this.activatedRoute.queryParams

            this.params$.pipe(
            filter(params => !!params['wiki-id']),
            mergeMap(params=> this.wikiService.getItem(params['wiki-id']))).subscribe(item =>{
                this.form.patchValue({
                    desc : item.desc,
                    content : item.content
                })
            });

    }

    ngOnInit(): void {
    }

    onSubmit(params :Params) {
        const data = {
            desc : this.form.get("desc").value,
            content : this.form.get("content").value
        };
        console.log(params)
        if(params['wiki-id']){
            console.log('update')
            this.wikiService.update(  params['wiki-id'] , data)
        }else{
            this.wikiService.add(data)
        }
    }

}
