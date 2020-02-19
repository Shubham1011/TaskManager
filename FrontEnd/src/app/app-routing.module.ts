import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasklistComponent } from './pages/tasklist/tasklist.component';
import {LoginpageComponent} from './pages/loginpage/loginpage.component'
import { SignupComponent } from './pages/signup/signup.component';

const routes: Routes = [
  {
    path:'',
    component:TasklistComponent
  },
  {
    path:'login',
    component:LoginpageComponent
  },{
    path:'signup',
    component:SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
