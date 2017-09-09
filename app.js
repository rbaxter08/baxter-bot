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

app.get('/spotify/token', (req, res) => {
	if (req && req.query && req.query.code) {
		Spotify.setAuthCode(req.query.code);
		Spotify.fetchAccessToken();
	} else {
		console.log('error fetching spotify token');
	}
	res.status(200).send('SPOTIFY!');
});

function launchWebSocket() {
	let url = `https://slack.com/api/rtm.connect?token=${TOKEN_BOT}`;
	console.log('Retrieving Web Socket...')
	request.post(url, {}, (err, response, data) => {
		let url = JSON.parse(data).url;
		ws = new WebSocket(url);
		ws.on('message', (res) => {
			const event = JSON.parse(res);
			const msg = event.text;
			const channel = event.channel;

			if (_.startsWith(msg, '$')) {
				const regex = new RegExp(/(\$)([a-zA-Z]*)/);
				const ticker = msg.match(regex)[2];
				Stock.getQuote(ticker).then((resp) => {
					Slack.reply('', channel, resp);
				}, (err) => {
					console.log(err);
					Slack.reply('BAXTER FUCKED UP :gotem:', channel);
				});
			} else if (_.startsWith(msg, '<https://open.spotify.com')) {
				Spotify.addSong(msg).then(resp => {
					Slack.reply('Song added', channel);
				}, err => {
					console.log('oops, song add fail');
					Slack.reply('Baxter fucked up! :gotem:');
				});
			}
		});
	});
}

launchWebSocket();

let timeout = 4.5 * 60 * 1000; //4.5 minutes in miliseconds
setInterval(ping, timeout);
function ping() {
	console.log('wake up!');
	request.get('https://baxter-bot.herokuapp.com/');
}
