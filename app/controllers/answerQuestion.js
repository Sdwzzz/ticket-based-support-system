// answer route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const userModel = mongoose.model("userModel");
const questionModel = mongoose.model("questionModel");
const answerModel = mongoose.model("answerModel");
const isAllFieldsAvailable = require('../../customMiddlewares/isAllFieldsAvailable');



module.exports = (app, responseFormat) => {

	_router.post('/answer',isAllFieldsAvailable, (req, res) => {

		userModel.findOne({"email":req.body.email}, function(err, user){

			if(err){
				console.log(err);
			}

			questionModel.findById({"_id":req.body.questionId}, function(err, question){
                console.log(question)
				if(err){
					console.log(err);
				}

				if(!question){
					let response = responseFormat(true,"there is no questions available for this question id",400,null);
					return res.json(response);
				}

				// create answer for this question
				let answer = {
					question : question,
					answer : req.body.answer,
					answeredBy : user
				}

				let newAnswer = new answerModel(answer);
				newAnswer.save((err)=>{
					if(err){
						console.log(err);
					}

					question.answers.push(newAnswer);
					question.save((err)=>{
						if(err){
							console.log(err);
						}
						user.questionsAnswered.push(question);
						user.save((err)=>{
							if(err){
								console.log(err);
							}

							let response = responseFormat(false,"answer successfully posted !!",200,null);
							return res.json(response);
						})
					})
				})

			}) // end

		}) // end

		
	}) // end


	// mount the router as an app level middleware
	app.use('/api',_router);

} // end