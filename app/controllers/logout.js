// logout route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();




module.exports = (app, responseFormat) => {

	_router.get('/logout', (req, res) => {
       
       // destroy the cookie
       res.cookie("token", null);
       let response = responseFormat(false,"successfully logged out !!!",200,null);
       res.json(response);

		
	}) // end


	// mount the router as an app level middleware
	app.use('/api',_router);

} // end