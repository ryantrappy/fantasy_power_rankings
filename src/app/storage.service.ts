import { Injectable } from '@angular/core';
import {TeamRanking} from './Models/TeamRanking';
import { LeagueConfig } from './Models/LeagueConfig';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getLeagueConfigs() {
    return JSON.parse(localStorage.getItem('configs'));
  }
  setLeagueConfigs(leagueConfigArray: Array<LeagueConfig>) {
    localStorage.setItem('configs', JSON.stringify(leagueConfigArray));
  }

  getCurrentWeekFromStorage(leagueName: string): Array<TeamRanking> {
    return JSON.parse(localStorage.getItem('cur-' + leagueName));
  }
  setCurrentWeekFromStorage(currentWeekObject: Array<TeamRanking>, leagueName: string) {
    localStorage.setItem('cur-' + leagueName, JSON.stringify(currentWeekObject));
  }
  getPreviousWeekFromStorage(leagueName: string): Array<TeamRanking> {
    return JSON.parse(localStorage.getItem('prev-' + leagueName));
  }
  setPreviousWeekFromStorage(currentWeekObject: Array<TeamRanking>, leagueName: string) {
    localStorage.setItem('prev-' + leagueName, JSON.stringify(currentWeekObject));
  }
}
