import {TeamRanking} from './TeamRanking';

export class LeagueConfig {

  constructor(props?) {
    if (!props){
      this.leagueName = 'Test name hold';
      this.introduction = 'introduction';
      this.rankingsTitle = 'Title';
      this.leagueId = '';
      this.week = 1;
      this.year = new Date().getFullYear();
      return;
    }
    this.leagueName = props.leagueName;
    this.introduction = props.introduction;
    this.leagueId = props.leagueId;
    this.week = props.week;
    this.year = props.year;
    this.rankingsTitle = props.rankingsTitle;
    this._id = props._id;
    if (props.teams){
      for (const team of props.teams){
        this.teams.push(team);
      }
    }
  }

  leagueName?: string;
  rankingsTitle: string;
  introduction: string;
  leagueId: string;
  week: number;
  year: number;
  teams: Array<TeamRanking> = [];
  // tslint:disable-next-line:variable-name
  _id?: string;
}
