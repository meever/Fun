// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: 'your-secret-clientID-here', // your App ID
		'clientSecret' 	: 'your-client-secret-here', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '463924745818-laflddbn3q991io8fsk601hrers8i4nc.apps.googleusercontent.com',
		'clientSecret' 	: "Wx6sYpn8zvk2QPSmFJoGZ2Vv",
		'callbackURL' 	: 'http://localhost:3001/auth/google/callback'
	}

};
