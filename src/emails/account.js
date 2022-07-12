const mailgun = require("mailgun-js");
const DOMAIN = '';
const mg = mailgun({apiKey: '', domain: DOMAIN});

const sendWelcomeEmail = (email, name) => {
	const data = {
		from: 'Excited User <me@samples.mailgun.org>',
		to: email,
		subject: 'Thanks for joining in!',
		text: `Welcome to Task Manager, ${name}. Let me know how you get along with the app.`
	};
	mg.messages().send(data, function (error, body) {
		console.log(body);
	})
};

const sendCancellationEmail = (email, name) => {
	const data = {
		from: 'Excited User <me@samples.mailgun.org>',
		to: email,
		subject: 'Sorry to see you go',
		text: `Dear ${name}, we confirm your cancellation. We hope to see you back someday soon. Farewell.`
	};
	mg.messages().send(data, function (error, body) {
		console.log(body);
	})
};
module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail
}