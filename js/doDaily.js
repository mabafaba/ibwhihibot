/**
 * Executes a callback function daily at 12:00 PM.
 *
 * @param {Function} callback - The callback function to be executed.
 */
const doDailyAt12 = function(callback){
    var now = new Date();
    var millisTill12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0) - now;
    if (millisTill12 < 0) {
         millisTill12 += 86400000; // it's after 12am, try 12am tomorrow.
    }
    setTimeout(function(){callback(); doDailyAt12(callback);}, millisTill12);
}


export {doDailyAt12};