var Twitter = require('twitter');
var config = require('./config.js');
var fs = require('fs');
var T = new Twitter(config);

// Create the SQLITE connection and connect to database
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/my-db.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the my-db database.');
  });
db.run('CREATE TABLE IF NOT EXISTS MLSE(name text, url text, tweet_volume text, city text, date text)');

//Parameters for the Twitter Api
var params = {
    q: '#nodejs',
    result_type: 'recent',
    lang: 'en'
  }

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
// Fetch the Trends
  var trend_locations = [];
  T.get('trends/available', params, function(err, data, response) {
    if(!err){
// Write the trends to a new file with the current date
      fs.writeFile("logs/log-"+ date.toString()+".txt", JSON.stringify(data), (err) => {
        if (err) throw err;    
        console.log('Logged!');
    });

    //Get Trending topics in Canada
    var trend_locations = data.filter(element => element.country === 'Canada');
    trend_locations.forEach(element =>{
      params = {
        id: element.woeid
      }
    // Get the trends from the location
      T.get('trends/place', params, function(err, data, response) {
        if(!err){
          var trends = data[0].trends;
          // Insert the Trend into the SQLITE table
          var stmt = db.prepare('INSERT INTO MLSE VALUES (?,?,?,?,?)');
          trends.forEach(trend =>{
            stmt.run(trend.name, trend.url, trend.tweet_volume, element.name, date);
          })
            //Finalize the statement
            stmt.finalize(); 
        }else{
          console.log(err);
        }
      });

    });
  }
  });








