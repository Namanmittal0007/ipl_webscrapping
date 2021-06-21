const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');


function getMatchPage(matchlink){
    request(matchlink, processScoreCard);
    function processScoreCard(error, response, html){
        if(error){
            console.log(error);
        }
        else{
            getPlayerPerformance(html);
        }
    }
    function getPlayerPerformance(html){
        let $ = cheerio.load(html);
        let matchDesc = $('.event .description').text().split(', ');
        let venue = matchDesc[1];
        let date = matchDesc[2];
        let result=$('.event .status-text').text();
        let teams = $('.event .teams .team');
        let team1 = $(teams[0]).find('.name-detail .name-link').text();
        let team2 = $(teams[1]).find('.name-detail .name-link').text();
        let teamTables = $('.match-scorecard-page>.card.content-block.match-scorecard-table>.Collapsible .batsman');
        for(let i = 0; i<teamTables.length; i++){
            let myteam = i==0 ? team1 : team2;
            let opp = i==0 ? team2 : team1;
            let teamPlayerRows = $(teamTables[i]).find('tbody tr');
            for(let j = 0; j<teamPlayerRows.length; j++){
                playerColumns=$(teamPlayerRows[j]).find('td');
                if($(playerColumns[0]).hasClass('batsman-cell')){
                    let nameUnedited=$(playerColumns[0]).find('a').text().split(/\s/);
                    let name="";
                    for(let j=0;j<nameUnedited.length-1;j++){
                        name+=nameUnedited[j]+" ";
                    }
                    name=name.trim();
                    let runs = $(playerColumns[2]).text();
                    let balls = $(playerColumns[3]).text();
                    let four = $(playerColumns[5]).text();
                    let six = $(playerColumns[6]).text();
                    let sr = $(playerColumns[7]).text();
                    makePlayerPerformanceEntry(myteam , name, venue, date, opp, result, runs, balls, four, six, sr);
                }
            }
        }
    }
}

function makePlayerPerformanceEntry(myteam , name, venue, date, opp, result, runs, balls, four, six, sr){
    let myteamDirPath = path.join(__dirname,'ipl',myteam);
    dirCreate(myteamDirPath);
    let playerFilePath = path.join(myteamDirPath, name + '.xlsx' );
    let content = readxlsx(playerFilePath, name);
    let playerObj = {
        myteam, name, venue, date, opp, result, runs, balls, four, six, sr
    };
    content.push(playerObj);
    writexlsx(playerFilePath, content, name);
}
function dirCreate(dirpath){
    if(!fs.existsSync(dirpath)){
        fs.mkdirSync(dirpath);
    }
}
function readxlsx(filePath, sheetName){
    if(!fs.existsSync(filePath)){
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let xlsxdata = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(xlsxdata);
    return ans;
}
function writexlsx(filePath, jsonData, sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}


module.exports = {
    getmatchpage : getMatchPage
};