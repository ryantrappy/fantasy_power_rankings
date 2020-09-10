import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IUser} from '../login/IUser';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private serviceUrl = 'http://localhost:3000/users/';

  constructor(
    private http: HttpClient
  ) { }

  getUserById(id: string): Observable<IUser> {
     return this.http.get<IUser>(this.serviceUrl + `${id}`).pipe(
       map((data: any) => {
      return data.data;
    }));
  }
}
