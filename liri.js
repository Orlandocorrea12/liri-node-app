require("dotenv").config();

var keys = require("./keys")

var axios = require("axios")

var Spotify = require('node-spotify-api');

var omdb = require('omdb');

var inquirer = require('inquirer');

var moment = require('moment')

var fs = require("fs")

var spotify = new Spotify(keys.spotify);
// inital prompt to fet everything started
inquirer.prompt([{
    message: "What topics would you like to search for? ",
    type: "list",
    name: "topics",
    choices: ["Music", "Movies", "Bands", "Do what it says"]
}]).then(answers => {
    // beginning of spotify search
    if (answers.topics === "Music") {
        inquirer.prompt([{
            message: "What song would you like to search for?",
            name: "search"
        }]).then(answers => {
            if (answers) {
                spotify.search({ type: 'track', query: answers.search, limit: 1 }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    };
                    console.log("This artists name is: " + data.tracks.items[0].album.artists[0].name);
                    console.log("The track name is: " + data.tracks.items[0].name);
                    console.log("If possible here is a preview url: " + data.tracks.items[0].preview_url);
                    console.log("Here is the album: " + data.tracks.items[0].album.name)
                });
            };
        });
    };
    // end of spotify search
    // beginning of bandsintown api
    if (answers.topics === "Bands") {
        console.log("It worked")
        inquirer.prompt([{
            message: "What band would you like to search for?",
            name: "search"
        }]).then(answers => {
            if (answers) {
                axios.get("https://rest.bandsintown.com/artists/" + answers.search + "/events?app_id=codingbootcamp").then(
                    function (response) {
                        console.log("The name of this venue: " + response.data[0].venue.name)
                        console.log("This venue is located in: " + response.data[0].venue.city + ", " + response.data[0].venue.country)
                        console.log("The date for this venue is: " + moment(response.data[0].datetime).format('MM/DD/YYYY'))
                    }
                );

            };
        });
    };
    // end of bit api 
    //start of omdb api search
    if (answers.topics === "Movies") {
        console.log("It works")
        inquirer.prompt([{
            message: "What movie would you like to search for?",
            name: "search"
        }]).then(answers => {
            if (answers) {

                axios.get("http://www.omdbapi.com/?t=" + answers.search + "&y=&plot=short&apikey=trilogy").then(
                    function (response) {
                        console.log("The title of the movie is: " + response.data.Title);
                        console.log("The year it was released is: " + response.data.Year);
                        console.log("The imdb rating is: " + response.data.imdbRating);
                        console.log("The Rotten Tomatoes rating is: " + response.data.Ratings[1].Value);
                        console.log("The country(s) it was filmed in is: " + response.data.Country);
                        console.log("The language of the movie is: " + response.data.Language);
                        console.log("The plot of the movie is: " + response.data.Plot);
                        console.log("The actors in this movie is: " + response.data.Actors);


                    }
                );
            };
        });
    };
    // start of random serach 
    if (answers.topics === "Do what it says") {
        console.log("success");
        inquirer.prompt([{
            message: "What topics would you like to get a random search for? ",
            type: "list",
            name: "topics",
            choices: ["Music", "Movies", "Bands"]
        }]).then(answers => {
            // music random search
            if (answers.topics === "Music") {
                fs.readFile("random.txt", "utf8", function (err, data) {
                    var randomtxt = data.split(",")
                    data = randomtxt[0];
                    if (err) {
                        console.log("Error occurred: " + err)
                    };
                    console.log(data);
                    spotify.search({ type: 'track', query: data, limit: 1 }, function (err, data) {
                        if (err) {
                            return console.log('Error occurred: ' + err);
                        };
                        console.log("This artists name is: " + data.tracks.items[0].album.artists[0].name);
                        console.log("The track name is: " + data.tracks.items[0].name);
                        console.log("If possible here is a preview url: " + data.tracks.items[0].preview_url);
                        console.log("Here is the album: " + data.tracks.items[0].album.name);
                    });
                });
            };
            // movies random search
            if (answers.topics === "Movies") {
                fs.readFile("random.txt", "utf8", function (err, data) {
                    var randomtxt = data.split(",")
                    data = randomtxt[1];
                    if (err) {
                        console.log("Error occurred: " + err)
                    };
                    console.log(data);
                    axios.get("http://www.omdbapi.com/?t=" + data + "&y=&plot=short&apikey=trilogy").then(
                        function (response) {
                            console.log("The title of the movie is: " + response.data.Title);
                            console.log("The year it was released is: " + response.data.Year);
                            console.log("The imdb rating is: " + response.data.imdbRating);
                            console.log("The Rotten Tomatoes rating is: " + response.data.Ratings[1].Value);
                            console.log("The country(s) it was filmed in is: " + response.data.Country);
                            console.log("The language of the movie is: " + response.data.Language);
                            console.log("The plot of the movie is: " + response.data.Plot);
                            console.log("The actors in this movie is: " + response.data.Actors);


                        }
                    );
                });

            };
            // bands random search
            if (answers.topics === "Bands") {
                fs.readFile("random.txt", "utf8", function (err, data) {
                    var randomtxt = data.split(",")
                    data1 = randomtxt[2];
                    if (err) {
                        console.log("Error occurred: " + err)
                    };
                    
                    console.log(data1);
                    axios.get("https://rest.bandsintown.com/artists/" + answers.search + "/events?app_id=codingbootcamp").then(
                        function (response) {
                            console.log("The name of this venue: " + response.data[0].venue.name)
                            console.log("This venue is located in: " + response.data[0].venue.city + ", " + response.data[0].venue.country)
                            console.log("The date for this venue is: " + moment(response.data[0].datetime).format('MM/DD/YYYY'))
                        }
                    );
                });
            };
        });
    };
});
