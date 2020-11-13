import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ArticleService} from "../../../shared/article.service";

@Component({
    selector: 'app-article-detail',
    template: `
        <div class="container">
            <div class="card my-3 shadow-sm">
                <form class="card-body" [formGroup]="form" (ngSubmit)="onSubmit()">
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

    constructor(public authService: AuthService,private formBuilder: FormBuilder, private articleService : ArticleService) {

        this.form = this.formBuilder.group({
            'desc' : this.formBuilder.control(null),
            'content':  this.formBuilder.control(null)
        });

    }

    ngOnInit(): void {
    }

    onSubmit() {
        this.articleService.add({
            desc : this.form.get("desc").value,
            content : this.form.get("content").value
        })
    }

}
