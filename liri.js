//Required needed to run
require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys");

//Spotify Keys
const env = process.env;
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

//Processes
var query = process.argv;
var type = process.argv[2];
var array = [];

//For loop the arguments and push them together
for (var i = 3; i < query.length; i++) {
    array.push(query[i]);
    array.push("+")
}

array.splice(-1); 
var finalSearch = array.join(""); 

//Switch Case
switch (type) {
    case 'concert-this':
        concertMe()
        break;
    case 'spotify-this-song':
        spotifyIt()
        break;
    case 'movie-this':
        movieThis()
        break;
    case 'do-what-it-says':
        itSays()
        break;
    default:
        console.log("The Sign by Ace of Base");
}

// Concert-this
function concertMe() {
    if (finalSearch === "") {
        console.log('\n')
        console.log("No Artist entered. Please enter an Artist")
        console.log('\n')
    } else {
        axios.get("https://rest.bandsintown.com/artists/" + finalSearch + "/events?app_id=codingbootcamp").then(
            function (response) {
                if (response.data.length <= 0) {
                    console.log("No info for this Artist")
                } else {
                    for (var i = 0; i < response.data.length; i++) {

                        var currData = `\n
    Venue: ${response.data[i].venue.name}
    Location: ${response.data[i].venue.city + ", " + response.data[0].venue.region}
    Event Date: ${moment(response.data[i].datetime).format('MM/DD/YYYY')}
            `
                        console.log(currData)
                    }
                }

                dataLog(currData)
            }
        );
    }
}

//Spotify-this-song
function spotifyIt() {

    if (finalSearch === "") {
        finalSearch = "ace+of+base+the+sign"
    }

    spotify.search({
        type: 'artist,track',
        query: finalSearch
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('\n')

        var currData = `\n
    Artist: ${data.tracks.items[0].artists[0].name}
    Track: ${data.tracks.items[0].name}
    Preview: ${data.tracks.items[0].preview_url}
    Album: ${data.tracks.items[0].album.name}
            `
        console.log(currData)
        dataLog(currData)

    });
}

//Movie-this
function movieThis() {

    if (finalSearch === "") {
        finalSearch = "mr+nobody"
    }

    axios.get("http://www.omdbapi.com/?t=" + finalSearch + "&y=&plot=short&apikey=trilogy").then(
        function (response) {

            var currData = `\n
    Title: ${response.data.Title}
    Released: ${response.data.Year}
    IMDB Rating: ${response.data.imdbRating}
    Rotten Tomatos Rating: ${response.data.Ratings[1].Value}
    Country: ${response.data.Country}
    Language: ${response.data.Language}
    Plot: ${response.data.Plot}
    Actors: ${response.data.Actors}
            `
            console.log(currData)
            dataLog(currData)
        }
    );
}

//Do-what-it-says
function itSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        finalSearch = dataArr[1];
        spotifyIt()
    });
}

//Log Information
var logQuery = query.splice(0, 2)
logQuery = "\n" + query.join(" ") + "\n"
console.log(logQuery)

fs.appendFile("log.txt", logQuery, function (err) {

    if (err) {
        console.log(err);
    } else {
        console.log("Log Updated");
    }

});

//Data Log
function dataLog(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Log Updated");
        }
    });
}