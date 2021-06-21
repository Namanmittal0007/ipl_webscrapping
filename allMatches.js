const request = require('request');
const cheerio = require('cheerio');

const scoreCardObj = require('./scoreCard');

function getAllMatchesPage(IplResultsPageLink){
    request(IplResultsPageLink, getAllResultsPage);
    function getAllResultsPage(error, response, html){
        if(error){
            console.log(error);
        }
        else{
            getMatchLinks(html);
        }
    }
    function getMatchLinks(html){
        let $ = cheerio.load(html);
        let allMatchLinkElem=$('[data-hover="Scorecard"]');
        let allMatchLinks=[];
        for(let i=0;i<allMatchLinkElem.length;i++){
                let matchScorecardLink=$(allMatchLinkElem[i]).attr()['href'];
                allMatchLinks.push("https://www.espncricinfo.com"+matchScorecardLink);
                scoreCardObj.getmatchpage(allMatchLinks[i]);
        }
        // scoreCardObj.getmatchpage(allMatchLinks[0]);
    }
}


module.exports = {
    getallmatchespage : getAllMatchesPage 
};
    