import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { ROLE } from './role';
import { RoleGuard } from './role.guard';
import { UnderDevelopmentComponent } from './underdevelopment.component';
import { UserComponent } from './user/user.component';
import { SensorComponent } from './sensor/sensor.component';
import { SystemComponent } from './system/system.component';
import { TestComponent } from './test/test.component';
import { ConnectionComponent } from './connection/connection.component';
import { IpaddressComponent } from './ipaddress/ipaddress.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DeviceinfoComponent } from './deviceinfo/deviceinfo.component';
import { NetworkinfoComponent } from './networkinfo/networkinfo.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {
    path: "login",
    component: AuthComponent
  },
  {
    path:"",
    canActivate:[AuthGuard],
    component: LayoutComponent,
    children:[
      {
        path:"",
        redirectTo:"dashboard",
        pathMatch:"full"
      },
      {
        path:"dashboard",
        component:HomepageComponent
      },
      {
        path: "Device-Info",
        data:{
          role:[ROLE.ADMIN]
        },
        canActivate:[RoleGuard],
        component: DeviceinfoComponent 
      },
      {
        path: "Network-Info",
        data:{
          role:[ROLE.ADMIN]
        },
        canActivate:[RoleGuard],
        component: NetworkinfoComponent
      },
      {
        path: "Account-Info",
        data:{
          role:[ROLE.ADMIN]
        },
        canActivate:[RoleGuard],
        component: AccountComponent
      },
      // {
      //   path: "settings/sensor-config",
      //   data:{
      //     role:[ROLE.ADMIN]
      //   },
      //   canActivate:[RoleGuard],
      //   component: SensorComponent
      // },
      // {
      //   path: "settings/connections",
      //   data:{
      //     role:[ROLE.ADMIN]
      //   },
      //   canActivate:[RoleGuard],
      //   component: ConnectionComponent
      // },
      // {
      //   path: "settings/system-config",
      //   data:{
      //     role:[ROLE.ADMIN]
      //   },
      //   canActivate:[RoleGuard],
      //   component: SystemComponent
      // },
      // {
      //   path: "settings/network-config",
      //   data:{
      //     role:[ROLE.ADMIN]
      //   },
      //   canActivate:[RoleGuard],
      //   component: UnderDevelopmentComponent
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
