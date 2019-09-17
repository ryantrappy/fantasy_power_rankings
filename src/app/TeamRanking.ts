export class TeamRanking {
  constructor() {
    this.teamName = 'Team Name';
    this.description = 'Manager\s name cannot change week to week as it is used to track previous weeks';
    this.managerName = 'Manager\s name';
    this.wins = 0;
    this.loss = 0;
    this.ties = 0;
  }

  teamName: string;
  description: string;
  managerName: string;
  wins: number;
  loss: number;
  ties: number;
  delta?: 0;
}
