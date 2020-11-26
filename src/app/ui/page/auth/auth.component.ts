import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/auth.service";

@Component({
  selector: 'app-auth',
  template: `
      <style>
          input[type="password"]:focus, input[type="email"]:focus {
              z-index: 1
          }
      </style>
      <div style="height: 100vh;width: 100vw;" class="d-flex align-items-center justify-content-center bg-light">
          <div class="card shadow-sm" style="width: 300px;margin-top: -200px">
              <ng-container *ngIf="userState$ | async as user; else notConnected">
                  <div class="card-body text-center">
                      <img src="../../../../assets/img/android-chrome-192x192.png" alt="logo" style="width:192px">

                      <ul class="list-unstyled mt-2">
                          <li><a [routerLink]="['../page/link-list']"
                                 [queryParams]="{'item-type' :'link', 'link-domaine' : 'pro'}" class="text-danger">Mes
                              liens pro</a></li>
                          <li><a [routerLink]="['../page/link-list']"
                                 [queryParams]="{'item-type' :'link', 'link-domaine' : 'perso'}" class="text-warning">Mes
                              liens perso</a></li>
                          <li><a [routerLink]="['../page/wiki-list']" [queryParams]="{'item-type' :'wiki'}"
                                 class="text-success">Mes wikis</a></li>
                      </ul>

                  </div>
              </ng-container>

              <ng-template #notConnected>
                  <header class="  text-center  my-3">
                      <img src="../../../../assets/img/android-chrome-192x192.png" alt="logo" style="width:192px">
                  </header>

                  <form [formGroup]="form" (ngSubmit)="onSubmit()"
                        class="card-body d-flex flex-column align-items-center">
      
                      <label for="iEmail" style="margin-bottom: 0"></label>
                      <input id="iEmail"
                             formControlName="email"
                             class="form-control" placeholder="Votre email" type="email"
                             style="border-bottom-left-radius: 0;border-bottom-right-radius: 0;" required="required"
                      >

                      <label for="iPassword" style="margin-bottom: 0"></label>
                      <input id="iPassword"
                             class="form-control"
                             placeholder="Votre password"
                             type="password"
                             style="border-top: none; border-top-left-radius: 0;border-top-right-radius: 0;"
                             formControlName="password" required="required"
                      >
                      <button type="submit" [disabled]="form.invalid || isSubmit"
                              class="mt-3 btn btn-primary btn-sm btn-block">
                          <i *ngIf="isSubmit" class="far fa-spin fa-spinner"></i>
                          Valider
                      </button>
                      <div class="text-left text-danger"
                           *ngIf="form.get('email').invalid && form.get('email').touched">
                          <small *ngIf="form.get('email').errors.required">Email requis</small>
                          <small *ngIf="form.get('email').errors.email">Format email invalide</small>
                      </div>
                      <div class="text-left text-danger"
                           *ngIf="form.get('password').invalid && form.get('password').touched">
                          <small *ngIf="form.get('password').errors.required">Password requis</small>
                          <small *ngIf="form.get('password').errors.minlength">Password longueur de 6 minimun</small>
                      </div>

                  </form>
              </ng-template>
          </div>
      </div>
  `,
  styles: [
  ]
})
export class AuthComponent implements OnInit {
    isSubmit =false;
    userState$: Observable<any>;
    form: FormGroup;

    constructor(public authService: AuthService,private formBuilder: FormBuilder) {
        this.userState$ = this.authService.user;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            'email': this.formBuilder.control('', Validators.compose(
                [Validators.required, Validators.email],
                )
            ),
            'password': this.formBuilder.control('', Validators.compose(
                [Validators.required, Validators.minLength(6)],
            ))
        });
    }

    onSubmit() {
        this.isSubmit =true
        this.authService.loginEmailPassword(this.form.get('email').value, this.form.get('password').value).finally(()=> this.isSubmit = false).catch(err => alert(err.message));
    }

}
