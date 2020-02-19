import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authservice:AuthService,
    private router : Router) { }
  public username=''
  public password=''
  
    ngOnInit() {
    }
  
    onsignup(){
      this.authservice.signup(this.username,this.password).subscribe((res:HttpResponse<any>)=>{
        console.log(res);
        alert("Sign up successfull , Login to Continue")
        this.router.navigateByUrl('/login')
        
      })
     
  
    }
    takelogin(){
      this.router.navigateByUrl('/login')
    }
  
}
