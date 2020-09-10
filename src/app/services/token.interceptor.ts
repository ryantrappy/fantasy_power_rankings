import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const header = this.auth.getAuth();
    const change = {
      setHeaders: {
        'content-type': 'application/json'
      }
    };

    if (header){
      // @ts-ignore
      change.setHeaders.Authorization = this.auth.getAuth();
    }
    request = request.clone(change);
    return next.handle(request);

  }
}
