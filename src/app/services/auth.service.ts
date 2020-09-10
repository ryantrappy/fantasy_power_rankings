import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serviceUrl = 'http://localhost:3000/auth/';
  private headers = {
    'content-type': 'application/json'
  };

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  setAuth(authResponse: any) {
    let authData = authResponse.data;
    authData = authData.replace('Authorization=', '');
    this.cookieService.set('AuthHeader', authData);
  }

  removeAuth() {
    this.cookieService.delete('AuthHeader');
  }

  getAuth(): string {
    return this.cookieService.get('AuthHeader');
  }

  getUserFromCookie() {
    const cookie = this.getAuth();
    if (!cookie) { return {}; }
    const decoded = jwt_decode(cookie);
    return decoded;
  }

  login(email: string, password: string) {
    const body = {
      email,
      password
    };
    return this.http.post<any>(this.serviceUrl + `login`, body, {headers: this.headers});
  }
}
