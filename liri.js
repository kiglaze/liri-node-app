var myKeys = require("./keys.js");
var command = process.argv[2];

var Twitter = require('twitter');
var twitterParams = {screen_name: 'KIGDevAccount'};
var twitterClient = new Twitter(myKeys.twitterKeys);


switch(command) {
	case("twitter"):
		printTwitterTweets(twitterParams, twitterClient);
		break;
	case("asdf"):
		break;
	case("qwerty"):
		break;
}

function printTwitterTweets(twitterParams, twitterClient) {
	twitterClient.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
	  if (!error) {
	    for (var i = 0; i < tweets.length; i++) {
	    	console.log(tweets[i].text);
	    }
	  } else {
	  	console.log("Error...");
	  	console.log(error);
	  }
	});
}


