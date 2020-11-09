import {Component, Injectable, OnInit, TrackByFunction, ViewChild} from '@angular/core';
import * as html2canvas from './libraries/html2canvas.min.js';
import * as fileSaver from './libraries/FileSaver.min.js';
import { StorageService} from './storage.service';
import {TeamRanking} from './Models/TeamRanking';
import {LeagueConfig} from './Models/LeagueConfig';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatTable} from '@angular/material/table';
import {RankingsService} from './services/rankings.service';
import * as sampleData from './data/LeagueConfigSample';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './login/login.component';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {IUser} from './login/IUser';
import {LeaguesService} from './services/leagues.service';
import {EditDialogComponent} from './edit/edit/edit.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private storageService: StorageService,
              private rankingsService: RankingsService,
              private leaguesService: LeaguesService,
              private authService: AuthService,
              private userService: UserService,
              public dialog: MatDialog) {
    this.cookie = this.authService.getUserFromCookie();
  }
  cookie: any;
  user: IUser;

  title = 'fantasy-power-rankings';
  currentLeague = '';
  currentYear = 2020;
  weeks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  currentWeek = 2;
  leagueConfig: LeagueConfig;
  newLeagueConfig: LeagueConfig = new LeagueConfig();
  leagueConfigForm: LeagueConfig = new LeagueConfig();
  leagues: { [key: string]: Array<LeagueConfig> } = {};
  displayedColumns: string[] = [' ', 'position', 'teamName', 'managerName', 'description', 'wins', 'losses', 'ties', 'edit'];


  currentWeekRanking: Array<TeamRanking> = [];

  ngOnInit(): void {
    if (this.cookie !== undefined && this.cookie._id){
      this.userService.getUserById(this.cookie._id).subscribe((data: any) => {
        this.user = data;
        this.currentLeague = this.user.leagues[0];
        this.initialize();
      });
    }
  }

  logout(): void {
    this.user = undefined;
    this.authService.removeAuth();
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loginDialogClosed();
    });
  }

  loginDialogClosed(): void {
    this.cookie = this.authService.getUserFromCookie();
    if (this.cookie !== undefined && this.cookie._id){
      this.userService.getUserById(this.cookie._id).subscribe((data: any) => {
        this.user = data;
      });
    }
  }

  openEditDialog(team: TeamRanking): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '80vw',
      data: team
    });

    dialogRef.afterClosed().subscribe(result => {
      this.editDialogClosed();
    });
  }

  editDialogClosed(): void {}

  initialize(): void {
    this.getLeagueById(this.currentLeague);
    this.generateRanking(this.currentLeague);
  }


  yearChange(): void {
    if ((this.currentYear + '').length !== 4) { return; }
    this.generateRanking(this.currentLeague);
  }

  getLeagueById(id: string): void {
    this.rankingsService.getRankingForLeague(id).subscribe((rankingData: any) => {
      this.leagues[id] = rankingData;
      if (rankingData[0] === undefined){
        console.log('creating new ranking');
        this.leagueConfigForm = new LeagueConfig();
        this.generateNewRanking(id);
      } else {
        console.log('loading previous');
        this.leagueConfigForm = new LeagueConfig(rankingData[rankingData.length - 1]);
        this.currentWeek = this.leagueConfigForm.week;
        this.currentYear = this.leagueConfigForm.year;
        this.table.renderRows();
      }


      this.getRankingImage();
    });
  }

  loadSelectedWeek() {
      this.currentWeek = this.leagueConfigForm.week;
      this.currentYear = this.leagueConfigForm.year;
      this.regenerateRankings();
  }

  generateNewRanking(id: string){
    this.leagueConfigForm = new LeagueConfig();
    this.leaguesService.getLeagueInfoForYear(id, this.currentYear).subscribe((leagueData: any) => {
      this.leagueConfigForm.leagueId = id;
      this.leagueConfigForm.leagueName = leagueData.name;
      this.leagueConfigForm.week = this.currentWeek;
      this.leagueConfigForm.year = this.currentYear;

      this.leaguesService.getTeamsForLeague(id, this.currentYear, this.currentWeek).subscribe((teamData: any) => {
        for (let i = 0; i < teamData.length; i++){
          teamData[i].teamId = teamData[i].id;
          teamData[i].position = i;
          const cur = new TeamRanking(teamData[i]);
          this.leagueConfigForm.teams.push(cur);
          console.log('adding team to new config');
          this.newLeagueConfig.teams.push(Object.assign({}, cur));
        }

        this.currentWeekRanking = [
          ...this.leagueConfigForm.teams
        ].map(i => ({ ...i}));

        this.regenerateRankings();

        this.table.renderRows();
      });
    });
  }

  generateRanking(id: string): void{
    const league = new LeagueConfig();
    league.leagueId = id;
    league.week = this.currentWeek;
    league.year = this.currentYear;

    this.leaguesService.getLeagueInfoForYear(id, new Date().getFullYear()).subscribe((leagueData: any) => {
      this.leagueConfigForm.leagueName = leagueData.name;
      this.leaguesService.getTeamsForLeague(id, this.currentYear, this.currentWeek).subscribe((teamData: any) => {
        for (let i = 0; i < teamData.length; i++){
          teamData[i].teamId = teamData[i].id;
          const cur = new TeamRanking(teamData[i]);
          league.teams.push(cur);
        }
        console.log(league.teams);
        league.teams.sort((a, b) => {
          return a.position - b.position;
        });
        console.log(league.teams);
        this.newLeagueConfig = league;
        this.table.renderRows();
      });
    });
  }


  save(){
    this.leagueConfigForm.week = this.currentWeek;
    this.leagueConfigForm.year = this.currentYear;
    for (let i = 0; i < this.leagueConfigForm.teams.length; i++) {
      this.leagueConfigForm.teams[i].position = i;
    }
    const bool = this.leagues[this.currentLeague].filter( cur => cur.week === this.leagueConfigForm.week && cur.year === this.leagueConfigForm.year);
    if (bool && bool.length > 0){
      this.rankingsService.updateRanking(this.leagueConfigForm).subscribe((response) => {
          console.log('success');
          this.initialize();
        },
        (err: any) => {
          console.error(err);
        });
      return;
    }
    this.rankingsService.saveRanking(this.leagueConfigForm).subscribe((response) => {
          console.log(response);
          this.initialize();
      },
        (err: any) => {
          console.error(err);
        });
  }

  getRecord(teamRanking: TeamRanking) {
    let result = teamRanking.wins + '-' + teamRanking.loss;
    if (teamRanking.ties !== 0) {
      result = result + '-' + teamRanking.ties;
    }
    return result;
  }
  regenerateRankings() {
    // Deep clone both arrays so that mutations don't affect table
    this.currentWeekRanking = [
        ...this.leagueConfigForm.teams
      ].map(i => ({ ...i}));

    // Clone league config
    this.leagueConfig = Object.assign({}, this.leagueConfigForm);
    this.getRankingImage();
  }

  drop(event: CdkDragDrop<Array<TeamRanking>>) {
    this.arrayMove(this.leagueConfigForm.teams, event.previousIndex, event.currentIndex);
    this.table.renderRows();
  }

  arrayMove(arr: Array<any>, oldIndex: number, newIndex: number): Array<any> {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr; // for testing
  }

  getPreviousWeekPosition(id: number) {
    // tslint:disable-next-line:triple-equals
    const previousWeek = this.leagues[this.currentLeague].find(cur => cur.year == this.currentYear && cur.week === (this.currentWeek - 1));
    if (!previousWeek) { return undefined; }
    return previousWeek.teams.findIndex ((element) => {
      return element.teamId === id;
    }) + 1;
  }
  getLastWeekPositionString(id: number) {
    const lastWeeksRanking = this.getPreviousWeekPosition(id);
    return (lastWeeksRanking) ? 'Last Week: ' + lastWeeksRanking : '';
  }

  getDelta(rankingObject: TeamRanking, i: number): number{
    let delta = 0;
    i++;
    const prev = this.getPreviousWeekPosition(rankingObject.teamId);
    if (prev === undefined) {
      delta = 0;
    } else {
      delta = i - this.getPreviousWeekPosition(rankingObject.teamId);
    }
    return delta;
  }

  getDeltaSymbolClass(rankingObject: TeamRanking, i: number) {
    const delta = this.getDelta(rankingObject, i);
    if (delta < 0) {
      return 'up';
    } else if (delta > 0) {
      return 'down';
    } else {
      return 'no-change';
    }
  }

  getDeltaClass(rankingObject: TeamRanking, i: number) {
    const delta = this.getDelta(rankingObject, i);
    if (delta < 0) {
      return 'delta-up';
    } else if (delta > 0) {
      return 'delta-down';
    } else {
      return '';
    }
  }

  getDeltaString(rankingObject: TeamRanking, i: number) {
    const delta = this.getDelta(rankingObject, i);
    if (delta === 0) {
      return '---';
    } else if (delta < 0) {
      return -delta;
    } else {
      return delta;
    }
  }
  getRankingImage() {
    const previousStyle = document.getElementById('images-styles');
    if (previousStyle) {
      previousStyle.remove();
    }
    let circleWidth = 60;
    let circleCount = 0;
    const circleMid = this.currentWeekRanking.length / 2;
    let circleChild = 4;
    let resultString = '';
    this.currentWeekRanking.forEach((ranking) => {
      const backgroundColor = (circleCount < circleMid) ? '#1D7225;' : 'firebrick;';
      resultString = resultString + 'tr.rank:nth-child(' + circleChild + ') .ranking {';
      resultString = resultString + '  background: ' + backgroundColor;
      resultString = resultString + '  width: ' + circleWidth + 'px;';
      resultString = resultString + '  height: ' + circleWidth + 'px;';
      resultString = resultString + '  line-height: ' + circleWidth + 'px;';
      resultString = resultString + '}';
      if (circleCount === circleMid - 1) {} else if (circleCount < circleMid) {
        circleWidth = circleWidth - 5;
      } else {
        circleWidth = circleWidth + 5;
      }
      circleCount++;
      circleChild++;
    });
    resultString = resultString + '';
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'images-styles';
    style.appendChild(document.createTextNode(resultString));
    head.appendChild(style);
  }

   generateScreenshot() {
    html2canvas(document.getElementById('powerRanking'),
      {
        width: 'fit-content',
        allowTaint: true,
        scale: 2,
        dpi: 300
      }).then((canvas) => {
      canvas.toBlob((blob) => {
        fileSaver.saveAs(blob, 'rankings.png');
        window.alert('Saved Power Rankings');
      });
    });
  }
}
