const express = require('express');
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