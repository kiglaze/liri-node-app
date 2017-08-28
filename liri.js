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

var omdbApiUrl = "http://www.omdbapi.com";
var request = require('request');
var omdbKeys = myKeys.omdbKeys;




switch(command) {
	case("my-tweets"):
		printTwitterTweets(twitterParams, twitterClient);
		break;
	case("spotify-this-song"):
		var songQuery = (process.argv[3]) ? (process.argv[3]) : "The Sign";
		searchSpotify(spotifyClient, songQuery);
		break;
	case("movie-this"):
		var movieName = (process.argv[3]) ? (process.argv[3]) : "Mr. Nobody";
		doMovieSearch(movieName);
		break;
}

function doMovieSearch(movieName) {
	movieName = prepareMovieTitleForSearch(movieName);
	var omdbApiKey = omdbKeys.api_key;
	var dataRequestUrl = `${omdbApiUrl}/?apikey=${omdbApiKey}&t=${movieName}`;
	request(dataRequestUrl, function(error, response, body) {
		if(!error) {
			var parsedResponse = JSON.parse(body);
			console.log("Title: " + parsedResponse.Title);
			console.log("Year: " + parsedResponse.Year);
			
			var ratings = parsedResponse.Ratings;
			for(var ratingIndex = 0; ratingIndex < ratings.length; ratingIndex++) {
				var rating = ratings[ratingIndex];
				if((rating.Source) === "Rotten Tomatoes" || (rating.Source) === "Internet Movie Database") {
					console.log(`Rating -- ${rating.Source}: ${rating.Value}`);
				}
			}

			console.log("Country: " + parsedResponse.Country);
			console.log("Language: " + parsedResponse.Language);
			console.log("Plot: " + parsedResponse.Plot);
			console.log("Actors: " + parsedResponse.Actors);
		} else {
			console.log('error:', error); // Print the error if one occurred 
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
		}
	});
}

function prepareMovieTitleForSearch(movieTitle) {
	var movieTitlePhrases = movieTitle.split(' ');
	for (var i = 0; i < movieTitlePhrases.length; i++) {
		movieTitlePhrases[i] = encodeURIComponent(movieTitlePhrases[i])
	}
	var preparedMovieTitle = movieTitlePhrases.join('+');
	return preparedMovieTitle;
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
