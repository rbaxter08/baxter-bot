'use strict';
const request = require("request");
const rp = require("request-promise");

const STOCK_TOKEN = 'IEL16DD3KAO0D7H6';

class RequestMaker {
  constructor() {
  }

  http(requestObj) {
    return rp(requestObj).catch(err => {
      console.log(err);
    });
  }

  fetchTicker(ticker) {
    let requestObj = {
      uri: `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${STOCK_TOKEN}`,
      json: true,
    };
    return this.http(requestObj);
  }

  fetchHistorical(ticker) {
    return this.http({
      uri: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&interval=1min&apikey=${STOCK_TOKEN}`,
      json: true,
    });
  }
}

module.exports = new RequestMaker();