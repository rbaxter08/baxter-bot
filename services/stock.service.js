'use strict';

const rm = require('./requestMaker.service.js');

//FINANCE API
const STOCK_TOKEN = 'IEL16DD3KAO0D7H6';

class Stock {
  constructor() { }

  getQuote(ticker) {
    return rm.fetchTicker(ticker).then((resp) => {
      //parse out latest price of stock
      let timeSeries = resp['Time Series (1min)'];
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
    });
  }
}

module.exports = new Stock();