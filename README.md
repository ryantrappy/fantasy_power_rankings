## Use Instructions

The current_power_rankings JSON order is the current order that the teams are ranked and previous_power_rankings JSON is the previous week's information.

The league_config.json contains league wide configuration information. 

After each week, you should copy your current_power_rankings to the previous_power_rankings file so that the change between weeks is calculated correctly.

Teams are tracked by their manager's name so this cannot change between weeks otherwise the change will not be calculated correctly.

After you have edited the json files correctly, open the manual_power_rankings.html file in any browser to view the rankings. 

To download, hit the download button and it will save a power rankings image file.

### Acknowledgments

Project based on work done originally by Joshua Mayer on the project https://github.com/jpmayer/fantasy-chrome-extension
