var express = require('express'); // Set up local server environment
var app = express();
app.use(express.static('public'));
app.listen(8080);

var mysql = require('mysql'); // MySQL Connection
var mysqlkey = require('./mysqlkey.json');
var con = mysql.createConnection({
  'host': mysqlkey.host,
  'user': mysqlkey.user,
  'password': mysqlkey.password,
  'database': 'pangea',
  'multipleStatements': 'true'
});
con.connect(function(err) {
  if (err)
    console.log(err);
  else {
    console.log('Connected to MySQL');
  };
});

var twitter = require('twitter'); // Twitter Connection
var twitterkey = require('./twitterkey.json');
var client = new twitter({
  consumer_key: twitterkey.consumer_key,
  consumer_secret: twitterkey.consumer_secret,
  access_token_key: twitterkey.access_token_key,
  access_token_secret: twitterkey.access_token_secret
});

app.get('/getlocation', function(req, res) { // Endpoint for displaying trends at marker's selected location
  var trendsJSON = {};
  client.get('trends/closest', {lat: req.query.lat, long: req.query.long}, function(error, body, response) { // Twitter API trends/closest request
    var woeid = body[0].woeid;
    var name = body[0].name;
    trendsJSON['location'] = name;
    client.get('trends/place', {id: woeid}, function(error, body, response) { // Twitter API trends/place request
      var trends = body[0].trends;
      for (i=0; i < trends.length; i++) {
        if (trends[i].tweet_volume != null) {
          trendsJSON[trends[i].name] = trends[i].url;
        };
      };
      res.send(trendsJSON); // Send json response containing trends to client-side
    });
  });
});

var username;

app.get('/bookmarks', function (req, res) { // Endpoint for displaying bookmarks for given user
  username = req.query.username;
  var create = "CREATE TABLE IF NOT EXISTS "+username+" (trend VARCHAR(20), url VARCHAR(200), date DATE, loc VARCHAR(20))";
  con.query(create, function(err, result) {
    if (result.warningCount == 0) {
      console.log("Bookmarks for user '"+username+"' initialized");
    } else {
      console.log("User '"+username+"' exists");
    }
  });
  var innerHTML = '<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Pangea</title><meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" /><link href="style.css" rel="stylesheet"><link href="https://i.imgur.com/gxbhuXV.png" rel="icon"></head><body><div class="navbar"><a href="#"><img src="https://i.ibb.co/hyBPjwQ/Untitled-design.png"></a><div class="bookmarks"><button onclick="window.history.back()">Back to Map</button></div></div><div class="data"><table><thead><tr><th>Trend</th><th>Location</th><th>Date Added</th></tr></thead><tbody>';
  var show = "SELECT * FROM "+username;
  con.query(show, function(err, result) {
    var bookmarks = result;
    for (const i in bookmarks) {
      innerHTML += '<tr><td><a href="'+`${bookmarks[i].url}`+'" target="_blank">'+`${bookmarks[i].trend}`+'</a></td><td>'+`${bookmarks[i].loc}`+'</td><td>'+`${bookmarks[i].date.toISOString().split('T')[0]}`+'</td></tr>';
    };
    innerHTML += '</tbody></table></div></body></html>';
    res.send(innerHTML); // Render bookmarks table for user
  });
});

app.get('/add', function(req, res) { // Endpoint for adding trend to user's bookmarks
  if (username == null) {
    res.send("Please log in!");
  };
  var date = new Date().toISOString().split('T')[0];
  var insert = "INSERT INTO "+username+" VALUES ('"+req.query.trend+"', '"+req.query.url+"', '"+date+"', '"+req.query.loc+"'); SELECT * FROM "+username;
  con.query(insert, function(err, result) {
    console.log("Added trend "+trend+" for user "+username);
  });
  var path = "/bookmarks?username="+username;
  res.redirect(path); // Redirect to user's bookmarks
});
