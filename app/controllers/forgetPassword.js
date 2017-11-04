// forget password route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const validator = require("email-validator");
const isAllFieldsAvailable = require('../../customMiddlewares/isAllFieldsAvailable');
const SMTP = require('../../config/SMTP');
const userModel = mongoose.model("userModel");
const userSecretModel = mongoose.model("userSecretModel");



module.exports = (app, responseFormat) => {

	_router.post('/forgetpassword',isAllFieldsAvailable, (req, res) => {
          
              // validate the provide email address
		        if(!(validator.validate(req.body.email))){
		          	 const response = responseFormat(true,'This is not a valid email address, try a valid one',400,null);
		          	 return res.json(response);
		          }  
		          
		       userModel.verifyEmail(req.body.email).then((user) => {

		       	      if(!user){
		       	      	// wrong emai address
		       	      	let response = responseFormat(true,"give email address is wrong, try correct one",400,null);
		       	      	return res.json(response);
		       	      }

		       	    // mail the user credentials to the registered email
		       	    userSecretModel.findOne({email:req.body.email}, function(err, secrets){
		       	    	if(err){
		       	    		console.log(err);
		       	    	}
		       	    	let email = secrets.email;
		       	    	let password = secrets.password;

			  let mailOptions={

			  	        from : "askELF",
			   			to : secrets.email,
			   			subject :"PASSWORD RECOVERY",
                        text : `userEmail : ${email}
                                password  : ${password}
                                `
			   		};

			  SMTP.sendMail(mailOptions, function(error, response){
			   			if(error){
			   				console.log(error);
			   				
			   			}else{
			   				console.log( response);
			   				
			   			}
			   		});


			  let response = responseFormat(false,"your password is mailed to your email",200,null);
			  return res.json(response);


		       	    }) // end


		       }) // end        


		
	}) // end


	// mount the router as an app level middleware
	app.use('/api',_router);

} // end