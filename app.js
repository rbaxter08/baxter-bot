const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

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
	console.log('recieved hello!');
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

app.post('/oauth', (req, res, next) => {
	console.log(req.body);
});

const TOKEN = 'xoxp-26503446353-214024588853-214047871506-82c88ebdbc46753600ea689e9084991e';
const TOKEN_BOT ='xoxb-214939346278-FWmSHRdjF1rw91KU0PJAJmQd';
const SCOPE = 'rtm:stream,client';
const CLIENT_ID = '26503446353.214933754470';
const CLIENT_SECRET = '49b8fea646167daefd4f535084abd45f';
const REDIRECT = 'https://baxter-bot.herokuapp.com/';
const VERIFICATION_TOKEN = 'tkPGmSRMWtxlWjw1rJZ0PsyP';


// request.post(`https://slack.com/api/rtm.connect?token=${token}&scope=${scope}`, {}, (err, response, data) => {
// 	console.log(data);
// });
// request({
// 	method: 'GET',
// 	url: `https://slack.com/oauth/authorize?client_id=${client_id}&scope=${scope}`
// }, (err, response, data) => {
// 	console.log(response);
// 	console.log(data);
// });
