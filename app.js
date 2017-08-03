const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const _ = require('lodash');

const TOKEN_BOT ='xoxb-214939346278-FWmSHRdjF1rw91KU0PJAJmQd';
const SCOPE = 'client';
const CLIENT_ID = '26503446353.214933754470';
const CLIENT_SECRET = '49b8fea646167daefd4f535084abd45f';
const REDIRECT = 'https://baxter-bot.herokuapp.com/';
const VERIFICATION_TOKEN = 'tkPGmSRMWtxlWjw1rJZ0PsyP';

let ws;

let app = express();
let port = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.status(200).send('Hello World!');
});

app.listen(port, () => {
	console.log('Listening on port ' + port);
});

app.post('/hello', (req, res, next) => {
	let userName = req.body.user_name;
	let botPayload = {
		text: `Hello ${userName}`,
	};

	if (userName !== 'baxterbot') {
		return res.status(200).json(botPayload);
	} else {
		return res.status(200).end();
	}
});

function launchWebSocket() {
	let url = `https://slack.com/api/rtm.connect?token=${TOKEN_BOT}`;
	console.log('Retrieving Web Socket...')
	request.post(url, {}, (err, response, data) => {
		let url = JSON.parse(data).url;
		ws = new WebSocket(url);
		ws.on('message', (res) => {
			let event = JSON.parse(res);
			console.log(event);
			let msg = event.text;
			if (_.startsWith(msg, '$')) {
				let regex = new RegExp(/(\$)([a-zA-Z]*)/);
				let ticker = msg.match(regex)[2];
				getStockQuote(ticker, event.channel);				
			}
		});
	});
}

function getStockQuote(ticker, channel) {
	console.log(`Sending request for ticker ${ticker}`);
	let url = `http://finance.google.com/finance/info?client=ig&q=${ticker}`;
	request.get(url, {}, (err, response, data) => {
		let d = data.replace('// ', '');
		let quote = JSON.parse(d)[0];
		replyStock(quote, channel);
	});
}

function replyStock(quote, channel) {
	let msg = `Ticker: ${quote.t} Current Price: ${quote.l}`;
	console.log(msg);

	let url = `https://slack.com/api/chat.postMessage?token=${TOKEN_BOT}&channel=${channel}&text=${msg}`;
	request.post(url);
}


launchWebSocket();
