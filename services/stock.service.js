'use strict';

const rm = require('./requestMaker.service.js');
const _ = require('lodash');

//mine
const colors = {
  red: '#ff4000',
  green: '#2eb82e',
}

//FINANCE API
const STOCK_TOKEN = 'IEL16DD3KAO0D7H6';

class Stock {
  constructor() { }

  getQuote(ticker) {
    return this.getCompanyName(ticker).then(company => {
      return rm.fetchTicker(ticker).then((resp) => {
        //parse out latest price of stock
        let timeSeries = resp['Time Series (1min)'];
        let latestQuote = this.formatStockData(timeSeries);
  
        const currentPrice = latestQuote[0] && latestQuote[0]["4. close"];

        return rm.fetchHistorical(ticker).then(response => {
          //parse out latest price of stock
          let data = response['Time Series (Daily)'];
          let quotes = this.formatStockData(data);
    
          const yesterDay = quotes[1] && quotes[1]["4. close"];
          const weekAgo = quotes[7] && quotes[7]["4. close"];
          const monthAgo = quotes[30] && quotes[30]["4. close"];
          const threeMonths = quotes[90] && quotes[90]["4. close"];

          return this.formatForSlack({
            company: company,
            price: currentPrice,
            dailyChange: this.getPercentChange(currentPrice, yesterDay),
            weeklyChange: this.getPercentChange(currentPrice, weekAgo),
            MonthlyChange: this.getPercentChange(currentPrice, monthAgo),
            threeMonthChange: this.getPercentChange(currentPrice, threeMonths),
          });
        })
      });
    });
  }

  formatStockData(timeSeries) {
    let results = _.chain(timeSeries)
                   .map((series, key) => {
                     _.extend(series, {
                       timeStamp: key,
                     });
                     return series;
                   })
                   .orderBy(['timeStamp'], ['desc'])
                   .value();
    return results;
  }

  getCompanyName(ticker) {
    return rm.http({
      uri: `https://api.stocktwits.com/api/2/search/symbols.json?q=${ticker}`,
      json: true,
    }).then(resp => {
      return resp.results[0].title;
    }); 
  }

  formatForSlack(data) {
    return [
      {
        pretext: `${data.company} - $${data.price} usd`,
        title: 'Past Day',
        text: `${data.dailyChange}%`,
        color: data.dailyChange >= 0 ? colors.green : colors.red,
      }, {
        title: 'Past Week',
        text: `${data.weeklyChange}%`,
        color: data.weeklyChange >= 0 ? colors.green : colors.red,
      }, {
        title: 'Past Month',
        text: `${data.MonthlyChange}%`,
        color: data.MonthlyChange >= 0 ? colors.green : colors.red,
      }, {
        title: 'Past 3 Months',
        text: `${data.threeMonthChange}%`,
        color: data.threeMonthChange >= 0 ? colors.green : colors.red,
      }
    ];
  }

  getPercentChange(current, previous) {
    return (((current - previous) / previous ) * 100).toFixed(2);
  }

}

module.exports = new Stock();