/**
* This module is responsible for crawling a website and streaming flat data at regular intervals.
* It exports two functions: streamFlatData and flatDataFromWebsite.
* 
* streamFlatData: Streams flat data at regular intervals and invokes a callback function with new flats.
* Parameters:
* - every_minutes: The interval in minutes at which to fetch flat data.
* - callback: The callback function to be invoked with new flats.
* - maxTimes: The maximum number of times to fetch flat data.
* 
* flatDataFromWebsite: Retrieves flat data from a website.
* Returns: A promise that resolves to an array of flat data.
* 
* Dependencies: node-fetch, node-html-parser, searchFilters.js
*/


// Rest of the code...

import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import searchFilterString from './searchFilters.js';
import db from './db.js';
/**
* Streams flat data at regular intervals and invokes a callback function with new flats.
* 
* @param {number} every_minutes - The interval in minutes at which to fetch flat data.
* @param {function} callback - The callback function to be invoked with new flats.
* @param {number} [maxTimes=Infinity] - The maximum number of times to fetch flat data.
*/
const streamFlatData =  function(every_minutes = 0.1, callback, maxTimes = Infinity) {
    const minutes = every_minutes;
    const the_interval = minutes * 60 * 1000;
    
    var counter = 0;

    var looper = setInterval(
        ()=>{
            // stop after maxTimes
            counter++;
            if(counter > maxTimes){
                console.log("max times reached, stopping");
                clearInterval(looper);
                return;
            }

            // fetch from website, save new flats to database, and invoke callback
            flatDataFromWebsite().then((data)=>{
                data.forEach(async (flat)=>{
                const isNew = await db.isFlatNew(flat);
                    if(isNew){
                        db.saveFlat(flat);
                        callback(flat);
                    }
                });
                
            });
        }
        , the_interval);
        
    }
    
    
    
    
    /**
    * Retrieves flat data from a website.
    * 
    * @returns {Promise<Array>} A promise that resolves to an array of flat data.
    */
    const flatDataFromWebsite = function() {
        console.log("checking for updates at ", new Date());
        return fetchNewData().then(parseFlatData);
        
    }
    
    
    
    /**
    * Fetches new data from the server.
    * 
    * @returns {Promise<Object>} A promise that resolves to the fetched data as html.
    */
    function fetchNewData() {
        
        const sfs = searchFilterString();
        
        return fetch("https://inberlinwohnen.de/wp-content/themes/ibw/skript/wohnungsfinder.php", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0",
                "Accept": "*/*",
                "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Priority": "u=0"
            },
            "referrer": "https://inberlinwohnen.de/wohnungsfinder/",
            "body": sfs,
            
            "method": "POST",
            "mode": "cors"
        }).then(res=>{return res.json()})
        .catch(err=>{console.log(err)});
    }
    
    
    /**
    * Parses the html data fetched from the site and returns an array of objects with the key info.
    * 
    * @param {object} data - The flat data to be parsed.
    * @returns {Array} - An array of flat objects containing title, details, relativeLink, and link properties.
    */
    function parseFlatData(data){
        const htmlString = data.searchresults;
        const root = parse(htmlString);
        // find <ul id="_tb_relevant_results"
        
        var list = root.querySelector('ul#_tb_relevant_results');
        
        
        var i = 0;
        const json = list.querySelectorAll('li').map((item) => {
            
            var flat = {
                title: item.querySelector('h2').text,
                details: item.querySelector('h3').text,
                // link is in
                // parent > .section_group > .list_col > a
                relativeLink: item.querySelector('a[title="Die detailierte Wohnungsanzeige öffnet in einem neuen Fenster"]').getAttribute('href'),
            };
            
            flat.link = fullDetailsURL(flat.relativeLink);
            
            return flat;
        });
        
        
        return json;
    }
    
    
    
    /**
    * Generates the full details URL by appending the relative URL to the base URL.
    *
    * @param {string} relativeURL - The relative URL of the details page.
    * @returns {string} - The full details URL.
    */
    function fullDetailsURL(relativeURL){
        //https://inberlinwohnen.de/gpgf_W1100.02533.0073-0202.html
        
        return "https://inberlinwohnen.de/" + relativeURL;
    }
    
    
    
 
    
    
    
    export { streamFlatData, flatDataFromWebsite };
    
    