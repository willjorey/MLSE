# MLSE
Install the packages
`npm install`

To run the application type in the terminal

`node app.js`

This is a nodejs application, it uses the Twitter package and pulls data from the "Trends Available" endpoint. Which then writes the response into a file with the current date into the folder "logs". After finding all the locations that are trendings we filter out Canada. Next, we find the trending topics in Canada by making another API call to the endpoint "Trends Places". Lastly, the application connects to SQLITE database located on disk and inserts the trend into the TABLE called "MLSE".