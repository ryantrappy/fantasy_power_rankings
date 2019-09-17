import {Component, Injectable, OnInit} from '@angular/core';
import * as html2canvas from "./libraries/html2canvas.min.js"
import * as fileSaver from "./libraries/FileSaver.min.js"
import { StorageService} from "./storage.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private storageService: StorageService) {
    this.configsArray = storageService.getLeagueConfigs();
    if(!this.configsArray || this.configsArray.length === 0) {
      this.configsArray = [
        {
          "rankingsTitle": "Rankings Title",
          "introduction": "This is introduction text if the user wants to preface the rankings with some text. The text can be an introduction to the year or anything else.",
          "leagueName": "test"
        }
      ]
    }
    else {
      this.currentWeekRanking = storageService.getCurrentWeekFromStorage(this.configsArray[0].leagueName);
      this.previousWeekRanking = storageService.getPreviousWeekFromStorage(this.configsArray[0].leagueName);
      this.currentWeekRankingForm = storageService.getCurrentWeekFromStorage(this.configsArray[0].leagueName);
      this.previousWeekRankingForm = storageService.getPreviousWeekFromStorage(this.configsArray[0].leagueName);
    }
    this.leagueConfig = this.configsArray[0];
  }
  title = 'fantasy-power-rankings';
  currentWeekRanking: Array<TeamRanking> = [
    {
      "teamName": "Test Winner",
      "description": "They did their best this week but sometimes that just is good enough.",
      wins: 1,
      loss: 0,
      ties: 0,
      "managerName": "Joe Winner"
    },
    {
      "teamName": "Test Loser",
      "description": "They did their best this week but sometimes that just is not good enough.",
      wins: 0,
      loss: 1,
      ties: 0,
      "managerName": "Joe Loser"
    },
    {
      "teamName": "Test Loser",
      "description": "They did their best this week but sometimes that just is not good enough.",
      wins: 0,
      loss: 1,
      ties: 0,
      "managerName": "Joe Loser1"
    },
    {
      "teamName": "Test Loser",
      "description": "They did their best this week but sometimes that just is not good enough.",
      wins: 0,
      loss: 1,
      ties: 0,
      "managerName": "Joe Loser2"
    }
  ];
  previousWeekRanking: Array<TeamRanking> = [
    {
      "teamName": "Test Winner",
      "description": "They did their best this week but sometimes that just is good enough.",
      wins: 1,
      loss: 0,
      ties: 0,
      "managerName": "Joe Winner"
    },
    {
      "teamName": "Test Loser",
      "description": "They did their best this week but sometimes that just is not good enough.",
      wins: 0,
      loss: 1,
      ties: 0,
      "managerName": "Joe Loser2"
    },
    {
      "teamName": "Test Loser",
      "description": "They did their best this week but sometimes that just is not good enough.",
      wins: 0,
      loss: 1,
      ties: 0,
      "managerName": "Joe Loser"
    },
    {
      "teamName": "Test Loser",
      "description": "They did their best this week but sometimes that just is not good enough.",
      wins: 0,
      loss: 1,
      ties: 0,
      "managerName": "Joe Loser1"
    }
  ];
  currentWeekRankingForm: Array<TeamRanking> = this.currentWeekRanking;
  previousWeekRankingForm: Array<TeamRanking> = this.previousWeekRanking;
  leagueConfig: LeagueConfig;
  configsArray: Array<LeagueConfig> = [];

  ngOnInit(): void {
    this.getRankingImage();
  }
  regenerateRankings() {
    this.storageService.setCurrentWeekFromStorage(this.currentWeekRankingForm, this.leagueConfig.leagueName);
    this.storageService.setPreviousWeekFromStorage(this.previousWeekRankingForm, this.leagueConfig.leagueName);
    this.storageService.setLeagueConfigs(this.configsArray);
    // Deep clone both arrays so that mutations don't affect table
    this.currentWeekRanking = [
      ...this.currentWeekRankingForm
    ].map(i => ({ ...i}));
    this.previousWeekRanking = [
      ...this.previousWeekRankingForm
    ].map(i => ({ ...i}));
  }

  getPreviousWeekPosition(managerName: string) {
    return this.previousWeekRanking.findIndex ((element) => {
      return element.managerName === managerName;
    }) + 1;
  }
  getLastWeekPositionString(managerName: string) {
    const lastWeeksRanking = this.getPreviousWeekPosition(managerName);
    return (lastWeeksRanking) ? 'Last Week: ' + lastWeeksRanking : ''
  }

  getDeltaSymbolClass (delta) {
    if(delta < 0) {
      return "up";
    } else if(delta > 0) {
      return "down";
    } else {
      return "no-change";
    }
  };

  getDeltaClass (delta) {
    if(delta < 0) {
      return "delta-up";
    } else if(delta > 0) {
      return "delta-down";
    } else {
      return "";
    }
  };

  getDeltaString (delta) {
    if(delta === 0) {
      return "---";
    } else if (delta < 0){
      return -delta;
    } else {
      return delta;
    }
  };
  getRankingImage() {
    let circleWidth = 60;
    let circleCount = 0;
    let circleMid = this.currentWeekRanking.length / 2;
    let circleChild = 4;
    let resultString = '';
    this.currentWeekRanking.forEach((ranking) => {
      console.log(circleMid, circleCount, circleChild, circleWidth)
      let backgroundColor = (circleCount < circleMid) ? "#1D7225;" : "firebrick;";
      resultString = resultString + "tr.rank:nth-child(" + circleChild + ") .ranking {";
      resultString = resultString + "  background: " + backgroundColor;
      resultString = resultString + "  width: " + circleWidth + "px;";
      resultString = resultString + "  height: " + circleWidth + "px;";
      resultString = resultString + "  line-height: " + circleWidth + "px;";
      resultString = resultString + "}";
      if(circleCount === circleMid - 1) {}
      else if(circleCount < circleMid) {
        circleWidth = circleWidth - 5
      } else {
        circleWidth = circleWidth + 5
      }
      circleCount++;
      circleChild++;
    });
    resultString = resultString + "";

    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(resultString));
    head.appendChild(style);
  }

   generateScreenshot() {
    html2canvas(document.getElementById("powerRanking"),
      {
        width: "fit-content",
        allowTaint: true,
        scale: 2,
        dpi: 300
      }).then(function(canvas) {
      canvas.toBlob((blob) => {
        fileSaver.saveAs(blob, "rankings.png");
        window.alert('Saved Power Rankings');
      });
    });
  }
}
