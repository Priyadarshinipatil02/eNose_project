import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ChartModule } from './chart/chart.module';
import { UserComponent } from './user/user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { UnderDevelopmentComponent } from './underdevelopment.component';
import { TopComponent } from './layout/top/top.component';
import { StatusPipe } from './pipes/status.pipe';
import { UserTypePipe } from './pipes/user.type.pipe';
import { SwlDirective } from './directive/swl.directive';
import { SwlProgressDirective } from './directive/swl.progress.directive';
import { SensorComponent } from './sensor/sensor.component';
import { SensorStatusPipe } from './pipes/sensor.status.pipe';
import { SystemComponent } from './system/system.component';
import { SensorStatusNamePipe } from './pipes/sensor.status.name.pipe';
import { EventCriteriaTypePipe } from './pipes/event.criteria.type.pipe';
import { TestComponent } from './test/test.component';
import { ConnectionComponent } from './connection/connection.component';
import { IpaddressComponent } from './ipaddress/ipaddress.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceinfoComponent } from './deviceinfo/deviceinfo.component';
import { NetworkinfoComponent } from './networkinfo/networkinfo.component';
import { HomepageComponent } from './homepage/homepage.component'

import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    UserComponent,
    HomepageComponent,
    UnderDevelopmentComponent,
    TopComponent,
    StatusPipe,
    UserTypePipe,
    SwlDirective,
    SwlProgressDirective,
    SensorComponent,
    SensorStatusPipe,
    SensorStatusNamePipe,
    EventCriteriaTypePipe,
    SystemComponent,
    TestComponent,
    ConnectionComponent,
    IpaddressComponent,
    DeviceinfoComponent,
    NetworkinfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    ChartModule,
    NgChartsModule,
    FormsModule,
    BrowserAnimationsModule,
    CommonModule
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
