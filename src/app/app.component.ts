import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "./shared/auth.service";

import * as algoliasearch from 'algoliasearch/lite';



@Component({
  selector: 'app-root',
  template: `          
      <router-outlet>
      </router-outlet>
      <router-outlet name="modal"></router-outlet>
  `,
  styles: []
})
export class AppComponent {

}
