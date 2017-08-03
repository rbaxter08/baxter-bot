const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const _ = requier('lodash');

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
			let data = JSON.parse(res);
			let msg = data.text;
			if (_.startsWith(msg, '$')) {
				console.log('Now I\'ll retrieve Stock price!!');
			}
		});
	});
}

launchWebSocket();
