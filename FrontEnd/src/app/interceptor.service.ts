import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, empty } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private authservice:AuthService) { }
refreshing=false
 intercept(request:HttpRequest<any>,next :HttpHandler): Observable<any>{
  
    request=this.addheader(request)
return next.handle(request).pipe(
  catchError((err:HttpErrorResponse)=>{
    
    if(err){
      console.log('error');
      if(err.status===401 && !this.refreshing)
      {
        return  this.refreshaccesstoken().pipe(
          switchMap(()=>{
            request=this.addheader(request)
            return next.handle(request)
          }),
          catchError((err)=>{
            console.log(err.message);
            this.authservice.logout()
            return empty()
            
          })
        )
      }
    return throwError(err)
    
  }
  })
)
  }

  refreshaccesstoken(){
    this.refreshing=true
    return this.authservice.refreshaccesstoken().pipe(
      tap(()=>{
        this.refreshing=false
        console.log('access token refreshed');
        
      })
    )
  }

  addheader(request:HttpRequest<any>){
    const token= this.authservice.getAccesstoken()
    if(token)
    {
      console.log('adding header');
      
      return request.clone({
        setHeaders:{
          'x-access-token':token
        }
      })
    }

    return request;

  }
}
