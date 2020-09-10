import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaguesService {

  private serviceUrl = 'http://localhost:3000/leagues/';

  constructor(
    private http: HttpClient
  ) { }

  getLeagueInfoForYear(id: string, year: number): Observable<any> {
    return this.http.get<any>(this.serviceUrl + `${id}/seasons/${year}`).pipe(
      map((data: any) => {
        return data.data;
      }));
  }
  getTeamsForLeague(id: string, year: number, week: number): Observable<any> {
    return this.http.get<any>(this.serviceUrl + `${id}/seasons/${year}/weeks/${week}/teams`).pipe(
      map((data: any) => {
        return data.data;
      }));
  }
}
