
import { streamFlatData, flatDataFromWebsite} from './js/crawler.js';
import { bot } from './js/bot.js';
import { doDailyAt12 } from './js/doDaily.js';
import messages from './js/messageText.js';
import db from './js/db.js';


// add existing chat_ids from database to bot memory
db.storedChatIDs().then((chatids)=>{
    chatids.forEach((chatid)=>{
        bot.rememberChat(chatid);
    });
});

// how the bot welcomes new users:

function welcomeNewUser (bot, chatid) {
    console.log("welcoming new user", chatid);
    // end welcome text
    bot.telegram.sendMessage(chatid, 
        messages.welcome , { parse_mode: 'Markdown' }
    );
    
    // send the newest flat
    db.latestFlat().then((data) => {
        bot.telegram.sendMessage(chatid,messages.newFlat(data));
    });
}

// when bot is started or message received, save chat id to database and welcome new user
bot.start((ctx) => {
    db.saveChat(ctx.chat.id);
    bot.rememberChat(ctx.chat.id);
    welcomeNewUser(bot, ctx.chat.id);
})
bot.on('message', (ctx) => {
    db.saveChat(ctx.chat.id);
    bot.rememberChat(ctx.chat.id);
    welcomeNewUser(bot, ctx.chat.id);
});


bot.launch()


// every 30 seconds, check for new flats and send them to all subscribers
streamFlatData(0.5, (newFlat)=>{ 
        bot.sendMessageToAllSubscribers(messages.newFlat(newFlat));
});

// every day at 12:00 send a message to all subscribers
// that way they know when the bot dies
doDailyAt12(()=>{
    bot.sendMessageToAllSubscribers(message.imStillHere);
})










