const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const _ = require('lodash');

//SLACK
const TOKEN_BOT ='xoxb-214939346278-FWmSHRdjF1rw91KU0PJAJmQd';
const SCOPE = 'client';
const CLIENT_ID = '26503446353.214933754470';
const CLIENT_SECRET = '49b8fea646167daefd4f535084abd45f';
const REDIRECT = 'https://baxter-bot.herokuapp.com/';
const VERIFICATION_TOKEN = 'tkPGmSRMWtxlWjw1rJZ0PsyP';

//FINANCE API
const STOCK_API = 'IEL16DD3KAO0D7H6';

//SPOTIFY
const SPOTIFY_CLIENT = '1e990c0fb588470088a74493d0769821';
const SPOTIFY_SECRET = '82a2daae239249c49e02f70b201a2b15';

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

app.get('/spotify-token', (req, res) => {
	console.log(req);
	res.status(200).send('test');
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
				addSpotifySong(msg);
			}
		});
	});
}

function getStockQuote(ticker, channel) {
	console.log(`Sending request for ticker ${ticker}`);
	let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${STOCK_API}`;
	request.get(url, {}, (err, response) => {
		let data = JSON.parse(response.body);
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

		let quote = {
			ticker: ticker,
			price: latestQuote["4. close"],
		};
		replyStock(quote, channel);
	});
}

function replyStock(quote, channel) {
	let msg = `Ticker: ${quote.ticker} Current Price: ${quote.price}`;
	console.log(msg);

	let url = `https://slack.com/api/chat.postMessage?token=${TOKEN_BOT}&channel=${channel}&text=${msg}`;
	request.post(url);
}

function addSpotifySong(songURL) {
	//https://open.spotify.com/track/75nBbBcSc6unGATTuhB8Ig
	console.log('adding song to playlist');
	let regex = new RegExp(/(track\/)(.+)/);
	let songID = songURL.match(regex)[2];
	let user_id = '1226313191';
	let playlist_id = '2qi53ifcbF7kvD5HNjaxg5';
	let url = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks&uris=spotify:track:${songID},`;
	request.post(url, {}, (err, resp, data) => {
		console.log(err);
		console.log(resp);
	});
}

let url = `https://accounts.spotify.com/authorize/?client_id=1e990c0fb588470088a74493d0769821&response_type=code&scope=playlist-modify-public&redirect_uri=http://localhost:1337/spotify-token`;



launchWebSocket();

let timeout = 4.5 * 60 * 1000; //4.5 minutes in miliseconds
setInterval(ping, timeout);
function ping() {
	console.log('wake up!');
	request.get('https://baxter-bot.herokuapp.com/');
}
