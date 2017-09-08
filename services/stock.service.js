'use strict';

const rm = require('./requestMaker.service.js');

//FINANCE API
const STOCK_TOKEN = 'IEL16DD3KAO0D7H6';

class Stock {
  constructor() { }

  getQuote(ticker) {
    return rm.fetchTicker(ticker);
  }
}

module.exports = new Stock();