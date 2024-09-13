

import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import dotenv from 'dotenv'

const token = dotenv.config().parsed.BOT_TOKEN;

class BotWithMemory extends Telegraf {
    constructor(token) {
        super(token)
        this.all_bot_subscriber_chat_ids = [];

    }


    rememberChat(chat_id) {
        this.all_bot_subscriber_chat_ids.push(chat_id);
        // make sure chat_ids are unique
        this.all_bot_subscriber_chat_ids = [...new Set(this.all_bot_subscriber_chat_ids)];
    }

    sendMessageToAllSubscribers(message, options = {parse_mode: 'Markdown', disable_web_page_preview: true}) {
        this.all_bot_subscriber_chat_ids.forEach((chatid) => {
            this.telegram.sendMessage(chatid, message, options);
        });
    }

    
}

const bot = new BotWithMemory(token);



// catch all bot errors

bot.catch((err, ctx) => {
    console.log(`Error for ${ctx.updateType}`, err)

    // restart the bot if necessary
}
)




export { bot };