import {TeamRanking} from './TeamRanking';

export class LeagueConfig {

  constructor(props) {
    this.leagueName = 'Test name hold';
  }

  leagueName?: string;
  rankingsTitle: string;
  introduction: string;
  leagueId: string;
  week: number;
  year: number;
  teams: [TeamRanking];
}
