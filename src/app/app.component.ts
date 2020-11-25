import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
        <router-outlet></router-outlet>
        <router-outlet name="modal"></router-outlet>
    `,
    styles: []
})
export class AppComponent {

}
