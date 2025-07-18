import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user';
import { BredService } from './bread.service';
import { Title } from '../models/bredcrumb';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  user!:User;
  title:Title = {
    icon:"home",
    text:"Dashboard"
  };
  constructor(private authService:AuthService,private bredService:BredService){}
  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.bredService.title.subscribe((title)=>{
      this.title = title;
    })
  }
}
