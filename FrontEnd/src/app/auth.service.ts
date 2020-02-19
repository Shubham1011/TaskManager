import { Injectable } from '@angular/core';
import { TaskserviceService } from './taskservice.service';
import {shareReplay,tap} from 'rxjs/operators'
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private service:TaskserviceService,
    private router:Router,
    private http:HttpClient) { }

login=(username,password)=>{

return this.service.login(username,password).pipe(

  shareReplay(),
  tap((res:HttpResponse<any>)=>{

    this.setsession(res.body._id,res.headers.get('x-access-token'),res.headers.get('x-refresh-token'))

  })
)
}

signup=(username,password)=>{

  return this.service.signup(username,password).pipe(
  
    shareReplay(),
    tap((res:HttpResponse<any>)=>{
  
      this.setsession(res.body._id,res.headers.get('x-access-token'),res.headers.get('x-refresh-token'))
  
    })
  )
  }

getAccesstoken(){
  return localStorage.getItem('x-access-token')
}

private setsession(uid,accessto,refreshto){
  localStorage.setItem('user-id',uid)
  localStorage.setItem('x-access-token',accessto)
  localStorage.setItem('x-refresh-token',refreshto)
}

private removesession(){
  localStorage.removeItem('user-id')
  localStorage.removeItem('x-access-token')
  localStorage.removeItem('x-refresh-token')
}

logout(){
  this.removesession()
  this.router.navigate(['/login'])
  
}

refreshaccesstoken(){
  return this.http.get('http://localhost:4300/users/users/me',{
    headers:{
      'x-refresh-token':localStorage.getItem('x-refresh-token'),
      'id':localStorage.getItem('user-id')
    },
    observe:'response'
  }).pipe(
    tap((res:HttpResponse<any>)=>{

      localStorage.setItem('x-access-token',res.headers.get('x-access-token'))

    })
  )
}


}
