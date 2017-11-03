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




// set the port
const port = process.env.PORT || 4000;




// initialize all app level middlewares
require('./config/middlewaresConfig')(app);


//  initialize all 

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
     
    



// let's kick the server
server.listen(port, ()=>console.log(`server is waiting for the requests on port ${port} `));





