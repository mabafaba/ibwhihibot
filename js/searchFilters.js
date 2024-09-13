
/**
 * Generates a search filter string based on the provided arguments.
 * @returns {string} The search filter string.
 */
function searchFilterString () {
    // default

    var searchFilters = {
        // "bez": ["01_00", "02_00", "07_00", "08_00", "09_00"],
        "miete_max": 2500,
        "qm_min": 60,
        "rooms_min": 2.5,
        "heizung_zentral": false,
        "heizung_etage": false,
        "energy_fernwaerme": false,
        "heizung_nachtstrom": false,
        "heizung_ofen": false,
        "heizung_gas": false,
        "heizung_oel": false,
        "heizung_solar": false,
        "heizung_erdwaerme": false,
        "heizung_fussboden": false,
        "seniorenwohnung": false,
        "maisonette": false,
        "etagen_dg": false,
        "balkon_loggia_terrasse": false,
        "garten": false,
        "wbs": 0,
        "barrierefrei": false,
        "gaeste_wc": false,
        "aufzug": false,
        "stellplatz": false,
        "keller": false,
        "badewanne": false,
        "dusche": false
    };

    // replace values if any are set in parameters
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i].key in searchFilters) {
            searchFilters[arguments[i].key] = arguments[i].value;
        }
    // if  argument provided and specifrically set to null, remove the key from the searchFilters
        if (arguments[i].key in searchFilters && arguments[i].value === 'none') {
            delete searchFilters[arguments[i].key];
        }
    }

    // combine into such a string
    // // q=wf-save-srch&save=false&bez%5B%5D=01_00&bez%5B%5D=02_00&bez%5B%5D=07_00&bez%5B%5D=08_00&bez%5B%5D=09_00&miete_min=&miete_max=2500&qm_min=60&qm_max=&rooms_min=2.5&rooms_max=&etage_min=&etage_max=&baujahr_min=&baujahr_max=&heizung_zentral=false&heizung_etage=false&energy_fernwaerme=false&heizung_nachtstrom=false&heizung_ofen=false&heizung_gas=false&heizung_oel=false&heizung_solar=false&heizung_erdwaerme=false&heizung_fussboden=false&seniorenwohnung=false&maisonette=false&etagen_dg=false&balkon_loggia_terrasse=false&garten=false&wbs=0&barrierefrei=false&gaeste_wc=false&aufzug=false&stellplatz=false&keller=false&badewanne=false&dusche=false"
    
    // combine bezirke array into appropriate string
    if (searchFilters["bez"]){
    searchFilters["bez%5B%5D"] = searchFilters["bez"].join("&bez%5B%5D=");
    delete searchFilters["bez"];
}
    // convert searchFilters object into a string
    var searchFiltersString = "q=wf-save-srch&save=false";
    for (var key in searchFilters) {
        searchFiltersString += "&" + key + "=" + searchFilters[key];
    }

    return searchFiltersString;
}

// default  export
export default searchFilterString;
