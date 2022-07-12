const mailgun = require("mailgun-js");
const DOMAIN = '';
const mg = mailgun({apiKey: '', domain: DOMAIN});
const data = {
	from: 'Excited User <me@samples.mailgun.org>',
	to: 'fgelato94@gmail.com',
	subject: 'Hello',
	text: 'Testing some Mailgun awesomness!'
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});