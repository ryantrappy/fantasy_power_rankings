class TeamRanking {
  teamName: string;
  description: string;
  managerName: string;
  wins: number;
  loss: number;
  ties: number;
  record?: string = this.wins + '-' + this.loss + '-' + this.ties;
  delta?: 0;
}
