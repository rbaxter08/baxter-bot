const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const _ = require('lodash');

//My Services
const Spotify = require('./services/spotify.service.js');
const Stock =  require('./services/stock.service.js');
const Slack = require('./services/slack.service.js');

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
		text: `test ${userName}`,
	};

	if (userName !== 'baxterbot') {
		return res.status(200).json(botPayload);
	} else {
		return res.status(200).end();
	}
});

app.get('/spotify/token', (req, res) => {
	if (req && req.query && req.query.code) {
		Spotify.getAccessToken(req.query.code).catch((err) => {
			console.log(err);
		});
	} else {
		console.log('error fetching spotify token');
	}
	res.status(200).send('SPOTIFY!');
});

app.get('/spotify/access', (req, res) => {
	console.log('HELLO');
	if (req && req.query && req.query.code) {
	} else {
		console.log('error fetching spotify token');
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
			} else if (_.startsWith(msg, '<https://open.spotify.com')) {
				Spotify.getToken();
			}
		});
	});
}

function getStockQuote(ticker, channel) {
	Stock.getQuote(ticker).then((resp) => {
		Slack.replyStock(resp, channel);
	});
}

launchWebSocket();

let timeout = 4.5 * 60 * 1000; //4.5 minutes in miliseconds
setInterval(ping, timeout);
function ping() {
	console.log('wake up!');
	request.get('https://baxter-bot.herokuapp.com/');
}
