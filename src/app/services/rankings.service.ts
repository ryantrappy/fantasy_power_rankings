import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LeagueConfig} from '../Models/LeagueConfig';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RankingsService {
  private serviceUrl = 'http://localhost:3000/rankings/';

  constructor(
    private http: HttpClient
  ) { }

  getRankingForLeague(leagueId: string): Observable<LeagueConfig> {
    return this.http.get<LeagueConfig>(this.serviceUrl + `leagues/${leagueId}`);
  }

  saveRanking(ranking: LeagueConfig): any {
    return this.http.post<any>(this.serviceUrl, ranking);
  }
}
