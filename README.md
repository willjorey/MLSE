# MLSE

To run the application type in the terminal

`node app.js`

This is a nodejs application, it uses the Twitter package and pulls data from the "Trends Available" endpoint. Which then writes the response into a file with the current date into the folder "logs". Next, the application connects to SQLITE database located on disk and inserts each object in the response into the TABLE called "MLSE"