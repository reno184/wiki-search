import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WikiService} from "../../../shared/wiki.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs";
import {mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-new-item',
  template: `
   <div *ngIf="item$ | async as item" class="card-body">
       <h4 class="card-title">
           {{item.desc}}
       </h4>
       <div class="card-text" [innerHTML]="item.content">
           
       </div>
       <footer class="my-3 text-center">
           <a routerLink="../wiki-list" title="retour" >Retour</a>
       </footer>
   </div>
  `,
  styles: [

  ]
})
export class NewItemComponent implements OnInit {
    item$:Observable<any>;

  constructor(private wikiService : WikiService,private router: Router, private  activatedRoute : ActivatedRoute) {
     this.item$ =  this.activatedRoute.queryParams.pipe(mergeMap(params => this.wikiService.getItem(params['wiki-id'])));
  }

  ngOnInit(): void {
  }


}
