// contains all static text used by the bot.

var messages = {
    imStillHere: `Hallo! Ich bin immer noch da und suche nach Wohnungen für dich. Wenn du diese Nachricht nicht täglich um 12:00 bekommst, ist der Bot nicht mehr für dich aktiv. Schicke mir eine nachricht, wenn ich antworte bist du wieder dabei. Bekommst du keine Antwort, dann ist der Bot kaputt!`,
    searchDescription: `>2.5 Zimmer \n>60qm,\nBezirke: alle\nMiete Maximal 2500, kein WBS`,
    newFlat: function (flat) {
        if(!flat){
            return 'Keine neuen Wohnungen gefunden';
        }
        if(!flat.title){
            console.log('No title in flat', flat);
            return 'Keine neuen Wohnungen gefunden (kein Titel)';
        }

        const markdownHypoerlink = `[${flat.title}](${flat.link})`
        return `${markdownHypoerlink} \n${flat.details}`
    }
}

messages.welcome = 'Hallo! Ich gebe innerhalb einer Minute bescheid wenn neue Wohnungen für folgende Kriterien verfügbar sind:\n'+messages.searchDescription+'\n\nDie neueste Wohnung hierzu:\n';

export default messages;