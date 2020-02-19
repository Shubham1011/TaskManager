import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasklistComponent } from './pages/tasklist/tasklist.component';
import { TaskserviceService } from './taskservice.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginpageComponent } from './pages/loginpage/loginpage.component';
import { InterceptorService } from './interceptor.service';
import { SignupComponent } from './pages/signup/signup.component';
@NgModule({
  declarations: [
    AppComponent,
    TasklistComponent,
    LoginpageComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
    
  ],
  providers: [
    TaskserviceService,
    {provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi:true}
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
