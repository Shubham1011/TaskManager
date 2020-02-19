import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {

  constructor(private authservice:AuthService,
    private router : Router) { }
public username=''
public password=''

  ngOnInit() {
  }

  onlogin(){
    this.authservice.login(this.username,this.password).subscribe((res:HttpResponse<any>)=>{
      console.log(res);
      if(res.status===200)
      {
        this.router.navigateByUrl('/')

      }
      
    })

  }

  takesignup(){
    this.router.navigateByUrl('/signup')
  }


}
