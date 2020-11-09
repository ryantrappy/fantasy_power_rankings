import {upperCaseFirstLetter} from '../Utils/Util';

export class TeamRanking {
  constructor(props?) {
    if (!props){
      this.teamName = 'Team Name';
      this.description = 'Description';
      this.managerName = 'Manager\s name';
      this.wins = 0;
      this.loss = 0;
      this.ties = 0;
      this.ties = 0;
      return;
    }
    this.teamName = props.name;
    this.description = 'Description';
    this.managerName = upperCaseFirstLetter(props.firstName) + ' ' + upperCaseFirstLetter(props.lastName);
    this.wins = props.wins;
    this.loss = props.losses;
    if (props.loss){
      this.loss = props.loss;
    }
    this.ties = props.ties;
    this.id = props._id;
    if (props.position !== undefined) {
      this.position = props.position;
    } else {
      this.position = this.teamId;
    }

    if (props.teamId){
      this.teamId = props.teamId;
    }
    else {
      this.teamId = props.id;
    }
  }

  teamName: string;
  description: string;
  managerName: string;
  wins: number;
  loss: number;
  ties: number;
  delta?: 0;
  id?: string;
  teamId?: number;
  position?: number;
}
