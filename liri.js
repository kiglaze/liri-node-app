var myKeys = require("./keys.js");
var command = process.argv[2];

var Twitter = require('twitter');
var twitterParams = {screen_name: 'KIGDevAccount'};
var twitterClient = new Twitter(myKeys.twitterKeys);

var Spotify = require('node-spotify-api');
var spotifyKeys = myKeys.spotifyKeys;
var spotifyClient = new Spotify({
	id: spotifyKeys.client_id,
	secret: spotifyKeys.client_secret
});


switch(command) {
	case("my-tweets"):
		printTwitterTweets(twitterParams, twitterClient);
		break;
	case("spotify-this-song"):
		var songQuery = (process.argv[3]) ? (process.argv[3]) : "The Sign";
		searchSpotify(spotifyClient, songQuery);
		break;
	case("qwerty"):
		break;
}

function printTwitterTweets(twitterParams, twitterClient) {
	twitterClient.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
	  if (!error) {
	  	console.log("------------------");
	    for (var i = 0; i < tweets.length; i++) {
	    	console.log(tweets[i].text);
	    	console.log(tweets[i].created_at);
	    	console.log("------------------");
	    }
	  } else {
	  	console.log("Error...");
	  	console.log(error);
	  }
	});
}

function searchSpotify(spotifyClient, query) {
	spotifyClient.search({ type: 'track', query: query }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		var tracksItems = data.tracks.items;
		console.log("------------------");
		for (var i = tracksItems.length - 1; i >= 0; i--) {
			var trackItem = tracksItems[i];
			console.log("Name: ");
			console.log(trackItem.name);
			var artists = trackItem.artists;
			console.log("...");
			console.log("Artists: ");
			for (var j = artists.length - 1; j >= 0; j--) {
				console.log(artists[j].name);
			}
			console.log("...");
			console.log("Preview URL: ");
			console.log(trackItem.preview_url);
			console.log("...");
			console.log("Album: ");
			console.log(trackItem.album.name);
			console.log("------------------");
		}
	});
}
