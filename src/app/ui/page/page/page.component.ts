import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page',
  template: `
          
      <router-outlet></router-outlet>
  `,
  styles: [
  ]
})
export class PageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
