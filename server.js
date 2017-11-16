// dependencies
const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const responseFormat = require('./customLib/responseFormat');
const mongoose = require("mongoose");


// initialize server and app
const app = express();
const server = http.createServer(app);

// set token secret
const secret = require('./secrets/tokenSecret');
app.set('secret', secret);


// set the port
const port = process.env.PORT || 3000;

// initialize the database connection
require('./config/dbConfig');


// set the static file folder
app.use(express.static(path.join(__dirname,"public")));


// initialize all app level middlewares
require('./config/middlewaresConfig')(app);


//  initialize all models

	// loop through all the model files and initialize the files
		fs.readdirSync(path.join(__dirname,'./app/models')).forEach((fileName) => {
			 //make sure file is js and then initialize 
		     	 if(fileName.indexOf('.js') !== -1){
		     	 	 require(`./app/models/${fileName}`);
		     	 }

		})




// initialize all the routes

	 // loop through all the controller files and initialize the files
	     fs.readdirSync(path.join(__dirname,'./app/controllers')).forEach((fileName) => {
	     	 //make sure file is js and then initialize 
	     	 if(fileName.indexOf('.js') !== -1){
	     	 	 require(`./app/controllers/${fileName}`)(app, responseFormat);
	     	 }
	     })
     
    
// initialize fall back routes
app.get('*', (req,res)=>{

	let response = responseFormat(true,'This is not a valid api, try a valid one',400,null)
    return res.json(response);
})

app.post('*', (req,res)=>{

	let response = responseFormat(true,'This is not a valid api, try a valid one',400,null)
	return res.json(response);
})


// let's kick the server
server.listen(port, ()=>console.log(`server is waiting for the requests on port ${port} `));





