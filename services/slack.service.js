'use strict';

const rm = require('./requestMaker.service.js');

//my tokens
const TOKEN_BOT ='xoxb-214939346278-FWmSHRdjF1rw91KU0PJAJmQd';


class Slack {
   constructor() {
   }

   reply(msg, channel) {
    return rm.http('post', {
        url: `https://slack.com/api/chat.postMessage?token=${TOKEN_BOT}&channel=${channel}&text=${msg}`,
    });
   }

   replyStock(quote, channel) {
    let msg = `Ticker: ${quote.ticker} Current Price: ${quote.price}`;
    this.reply(msg, channel);
   }
}

module.exports = new Slack();