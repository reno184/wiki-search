import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-page',
  template: `
      <div class="container" >
          <nav class="navbar navbar-expand-lg navbar-light bg-light shadow rounded mt-2">
              <div class="navbar-brand">
                  <img src="../../../../assets/img/favicon-32x32.png" alt="logo" width="32">
                  <ng-container *ngIf="$params | async as params">
                      {{getTile(params)}}
                  </ng-container>
                  
              </div>
              <ul class="navbar-nav mr-auto ">
                
              </ul>
              <div class="badge badge-primary p-2 badge-pill mr-1">
                  <a routerLink="/" class="text-white" title="Menu">
                      <i class="far fa-home"></i>
                  </a>
              </div>
              <div class="badge badge-primary p-2 badge-pill">
                  <a (click)="onSignOut()" role="button" class="text-white" title="Déconnexion">
                      <i class="far fa-lock-open"></i>
                  </a>
              </div>
          </nav>
      <router-outlet></router-outlet>
      </div>
  `,
  styles: [
  ]
})
export class PageComponent implements OnInit {
    $params: Observable<Params>;

  constructor(private authService: AuthService, private router: Router, private  activatedRoute : ActivatedRoute) {
      this.$params = this.activatedRoute.queryParams;
  }

  ngOnInit(): void {
  }
    getTile(params: Params) {
        const titles = {
            "link" : "Liens utiles",
            "wiki": "Liste des wikis",
        }
        return titles[params['item-type']] + (!!params['link-domaine'] ? (' (' + params['link-domaine'] + ')') : '');
    }
    onSignOut() {
        this.authService.logoff();
        this.router.navigateByUrl('/')
    }

}
