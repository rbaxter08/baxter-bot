'use strict';
const request = require("request");
const rp = require("request-promise");

const STOCK_TOKEN = 'IEL16DD3KAO0D7H6';

class RequestMaker {
  constructor() {
  }

  http(requestObj) {
    return rp(requestObj);
  }

  fetchTicker(ticker) {
    let requestObj = {
      uri: `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${STOCK_TOKEN}`,
      json: true,
    };
    return this.http(requestObj);
  }
}

module.exports = new RequestMaker();