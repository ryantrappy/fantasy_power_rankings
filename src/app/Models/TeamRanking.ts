export class TeamRanking {
  constructor(props?) {
    if(!props){
      this.teamName = 'Team Name';
      this.description = 'Manager\s name cannot change week to week as it is used to track previous weeks';
      this.managerName = 'Manager\s name';
      this.wins = 0;
      this.loss = 0;
      this.ties = 0;
      return;
    }
    this.teamName = props.name;
    this.description = 'Manager\s name cannot change week to week as it is used to track previous weeks';
    this.managerName = 'Manager\s name';
    this.wins = props.wins;
    this.loss = props.losses;
    this.ties = props.ties;
  }

  teamName: string;
  description: string;
  managerName: string;
  wins: number;
  loss: number;
  ties: number;
  delta?: 0;
}
