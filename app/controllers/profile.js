// profile route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const userModel = mongoose.model('userModel');
const questionModel = mongoose.model('questionModel');
const answerModel = mongoose.model('answerModel');
const jwtVerification = require('../../customMiddlewares/jwtVerification');



module.exports = (app, responseFormat) => {

	_router.get('/profile/:skip',jwtVerification, (req, res) => {

	   
       let query = questionModel.find();
       query.select('title question postedBy posted status game');
       query.sort({posted:-1});
       query.skip(parseInt(req.params.skip));
       query.limit(5);
	   
	 
	   query.populate({path:'postedBy',model:"userModel",select:{"userName":1}}).exec((err, questions)=>{

	   	  if(err){
	   	  	console.log(err);
	   	  }

	   	  let response = responseFormat(false,"all questions",200,questions);
	   	  return res.json(response);

	   })

         
	}) // end





	// mount the router as an app level middleware
	app.use('/api',_router);

} // end