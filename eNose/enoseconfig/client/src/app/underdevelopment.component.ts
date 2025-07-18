import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'under-development',
  template: `<h1>{{pagename | titlecase}} Under Development</h1>`
})
export class UnderDevelopmentComponent {
  pagename!:string;
  constructor(private route:Router){
    this.pagename = route.url.replace(/[-\/]/g," ")
  }
}
