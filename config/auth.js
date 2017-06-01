// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '309164076189226', // your App ID
        'clientSecret'    : 'd2669287d574570db5cec6d23821a530', // your App Secret
        //'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
		'callbackURL'     : 'https://contentfull-demo.herokuapp.com/auth/facebook/callback',
        'profileURL'	  : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email,picture.type(normal),gender'

    }

	/*
    'twitterAuth' : {
        'consumerKey'        : 'your-consumer-key-here',
        'consumerSecret'     : 'your-client-secret-here',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : 'your-secret-clientID-here',
        'clientSecret'     : 'your-client-secret-here',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }
	*/

};
