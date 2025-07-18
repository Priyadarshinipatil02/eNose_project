import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from 'src/app/Store';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() user!: User
  activeMenu!: string;
  inactivityTimeOut: number = 50 * 60 * 1000;
  wait: any
  showMobileMenu=false;
  signOut!:any;
  menus=[
    {
      name:"Home",
      url:"/dashboard",
      icon:"home"
    },
    {
      name:"settings",
      url:"/settings",
      icon:"signal",
      submenu:[
        {
          name:"Connections",
          url:"/settings/connections",
          icon:"podcast"
        },
        {
          name:"IP Address",
          url:"/settings/ip-address",
          icon:"podcast"
        },
        // {
        //   name:"Network",
        //   url:"/settings/network-config",
        //   icon:"wifi"
        // },
        // {
        //   name:"System",
        //   url:"/settings/system-config",
        //   icon:"cog"
        // },
       
      ]
    },
    // {
    //   name:"Info",
    //   icon:"info-circle",
    //   url:"info"
    // },
    {
      name:"Update Password",
      icon:"user",
      url:"/updatePwd"
    }
  ] as any;
  constructor(private router: Router, private authService:AuthService) {
    this.signOut = authService.signOut
   }

  timeOutHandler = () => {
    clearTimeout(this.wait)
    this.wait = setTimeout(() => this.authService.signOut(true), this.inactivityTimeOut);
  }

   
  handleClick = ()=>{
    this.showMobileMenu = false;   
  }

  // openUpdatePasswordModal() {
  //   this.userComponent;

  // }

  
  ngOnDestroy(): void {
    document.removeEventListener("mousemove", this.timeOutHandler);
    document.removeEventListener("keyup", this.timeOutHandler);
    document.removeEventListener("click",this.handleClick)
  }
  ngOnInit(): void {
    this.activeMenu = this.router.url.replace(/\//, "");
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd){
        this.activateMenu(event.url)
      }
    })
    this.activateMenu(this.activeMenu)    
    this.wait = setTimeout(() => this.authService.signOut(true), this.inactivityTimeOut);
    document.addEventListener("mousemove", this.timeOutHandler);
    document.addEventListener("keyup", this.timeOutHandler);
    document.addEventListener("click",this.handleClick)
  }

  activateMenu(url:string){
    this.menus = this.menus.map((m:any)=>{
      m.active = url.split("/").includes(m.url.replace(/\//, ""));
      return m
    })
  }

  isMenuActive(menu: string = ""): string {
    return this.activeMenu == menu ? 'active' : '';
  } 

  menuClickHandle(event:any,menu:number){
    this.menus[menu].active= !this.menus[menu].active
    event.stopPropagation()
  }

  openMobileMenu(event:any){
    this.showMobileMenu = !this.showMobileMenu;
    event.stopPropagation()
  }
 

}
