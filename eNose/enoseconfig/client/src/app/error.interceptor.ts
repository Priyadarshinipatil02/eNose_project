import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse)=>{
        const errorMessage = error?.error?.message || error?.error?.msg || "Server Not Reachable";
        if(error.status === HttpStatusCode.Unauthorized || error.status == HttpStatusCode.UnprocessableEntity){
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url, error: errorMessage}});
        }
        return throwError(errorMessage)
      })
    );
  }
}
