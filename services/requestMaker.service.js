'use strict';
const request = require('request');
const _ = require('lodash');

const STOCK_TOKEN = 'IEL16DD3KAO0D7H6';

class RequestMaker {
  constructor() {
  }

  http(type, requestObj) {
    return new Promise((resolve, reject) => {
      request[type](requestObj, (err, resp) => {
        if (err) {
          reject(`service failur on ${requestObj.url}`);
        } else {
          let cb;
          if (!requestObj.cb) {
            cb = (resp) => resp;
          } else {
            cb = requestObj.cb;
          }
          resolve(cb(resp));
        }
      }).auth();
    });
  }

  fetchTicker(ticker) {
    let requestObj = {
      url: `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${STOCK_TOKEN}`,
      cb: (resp) => {
        
        let data = JSON.parse(resp.body);
        let timeSeries = data['Time Series (1min)'];
        let latestQuote = _.chain(timeSeries)
          .map((series, key) => {
            _.extend(series, {
              timeStamp: key,
            });
            return series;
          })
          .orderBy(['timeStamp'], ['desc'])
          .head()
          .value();

        return !latestQuote ? {ticker: 'Oops', price: 'Could not find Ticker'} : {
          ticker: ticker,
          price: `${latestQuote["4. close"]}`,
        };
      },
    };
    return this._http('get', requestObj);
  }
}

module.exports = new RequestMaker();