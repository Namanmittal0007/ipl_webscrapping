const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');


const iplhomepage="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const allMatchesPageObj = require('./allMatches');


let iplDirPath = path.join(__dirname,'ipl');
dirCreate(iplDirPath);
function dirCreate(dirpath){
    if(!fs.existsSync(dirpath)){
        fs.mkdirSync(dirpath);
    }
}


request(iplhomepage,gethomepage);
function gethomepage(error, response, html){
    if(error){
        console.log(error);
    }
    else{
        getIplResultsPageLink(html);
    }
}
function getIplResultsPageLink(html){
    let $ = cheerio.load(html);
    let viewAllResultsButton = $('[data-hover="View All Results"]');
    viewAllResultsButton_attr=viewAllResultsButton.attr();
    let IplResultsPageLink="https://www.espncricinfo.com"+viewAllResultsButton_attr['href'];
    allMatchesPageObj.getallmatchespage(IplResultsPageLink);
}







