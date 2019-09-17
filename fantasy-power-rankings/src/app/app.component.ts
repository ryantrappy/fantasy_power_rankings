import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
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
  previousWeekRanking: Array<TeamRanking> = [];
  leagueConfig: LeagueConfig;

  ngOnInit(): void {
    this.getRankingImage();
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

   generateTeamRow(ranking: number, lastWeeksRanking: number, rankingObject: TeamRanking) {
    let delta = lastWeeksRanking ? ranking - lastWeeksRanking : 0;
    let lastWeekPositionString = (lastWeeksRanking) ? 'Last Week: ' + lastWeeksRanking : '';
    let teamName = "<div class='manager-name'>" + rankingObject.teamName + "</div>";
    return "<tr class='rank'> <td>" +
      "<div class='ranking'>" + ranking + "</div>" +
      "</td><td class='teamPicture' style='width:25px'></td>" +
      "<td style='width:20%;'>" + teamName + "<div class='team-record'>" + rankingObject.managerName + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ rankingObject.record +
      "</div></td>" +
      "<td class='center'><div class='delta-div'><div class='" + this.getDeltaSymbolClass (delta) + "'></div>" +
      "<div class='delta " + this.getDeltaClass (delta) + "'>" + this.getDeltaString (delta) + "</div></div" +
      "<div class='last-weeks-position'>" + lastWeekPositionString + "</div></td>" +
      "<td class='center' style='width: 50%';>" + rankingObject.description + "</td></tr>";
  };

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

  //
   generateScreenshot() {
    // html2canvas(document.getElementById("powerRanking"),
    //   {width: "fit-content", allowTaint: true}).then(function(canvas) {
    //   canvas.toBlob((blob) => {
    //     saveAs(blob, "rankings.png");
    //     window.alert('Saved Power Rankings');
    //   });
    // });
  }
  generateTable() {
    const outerDiv = document.getElementById("powerRanking")
    // Set config items
    document.getElementById("rankingTitle").innerText = this.leagueConfig.rankingsTitle;
    // If there is introductory text, display it
    if(this.leagueConfig.introduction && this.leagueConfig.introduction.length > 0) {
      document.getElementById("introductionRow").innerText = this.leagueConfig.introduction;
    } else {
      // $("#introduction").css("display","none");
    }
    // Generate Table
    let tableHTML;
    for (let i = 0; i < this.currentWeekRanking.length; i++) {
      const previousRanking = this.previousWeekRanking.findIndex ((element) => {
        return element.managerName === this.currentWeekRanking[i].managerName;
      });
      const rowHTML = this.generateTeamRow (i + 1, previousRanking + 1, this.currentWeekRanking[i]);
      // tableElement.append(rowHTML);
    }
 }

}
