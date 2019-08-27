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
db.run('CREATE TABLE IF NOT EXISTS MLSE(name text, url text, parentid text, country text, countryCode text, woeid text, date text)');

//Parameters for the Twitter Api
var params = {
    q: '#nodejs',
    result_type: 'recent',
    lang: 'en'
  }

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
// Fetch the Trends
  T.get('trends/available', params, function(err, data, response) {
    if(!err){
// Write the trends to a new file with the current date
      fs.writeFile("logs/log-"+ date.toString()+".txt", JSON.stringify(data), (err) => {
        if (err) throw err;    
        console.log('Logged!');
    });
// Insert the data into the SQLITE table
    var stmt = db.prepare('INSERT INTO MLSE VALUES (?,?,?,?,?,?,?)');
    data.forEach(element => {
        stmt.run(element.name, element.url, element.parentid, element.country, element.countryCode, element.woeid, date)
    });
    //Finalize the statement and close the database
    stmt.finalize();
    db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Close the database connection.');
      });  

    } else {
      console.log(err);
    }
  });




