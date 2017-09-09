'use strict';

const rm = require('./requestMaker.service.js');
const _ = require('lodash');

//my tokens
const TOKEN_BOT = 'xoxb-214939346278-FWmSHRdjF1rw91KU0PJAJmQd';

class Slack {
  constructor() {
  }

  reply(msg, channel, attachments) {
    let requestObj = {
      method: 'POST',
      url: `https://slack.com/api/chat.postMessage?token=${TOKEN_BOT}&channel=${channel}`,
      qs: {},
    };
    if (msg) {
      _.extend(requestObj.qs, {
        text: msg,
      });
    } else {
      _.extend(requestObj.qs, {
        attachments: JSON.stringify(attachments),
      });
    }
    return rm.http(requestObj);
  }
}

module.exports = new Slack();