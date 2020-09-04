import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IUser} from '../login/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serviceUrl = 'http://localhost:3000/auth/';
  private headers = {
    'content-type': 'application/json'
  };

  constructor(
    private http: HttpClient
  ) { }

  login(email: string, password: string) {
    const body = {
      email,
      password
    };
    return this.http.post<any>(this.serviceUrl + `login`, body, {headers: this.headers});
  }
}
