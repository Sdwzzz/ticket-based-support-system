// ask question route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const questionModel = mongoose.model("questionModel");
const userModel = mongoose.model("userModel");
const isAllFieldsAvailable = require('../../customMiddlewares/isAllFieldsAvailable');
const SMTP = require('../../config/SMTP');
const jwtVerification = require('../../customMiddlewares/jwtVerification');



module.exports = (app, responseFormat) => {

    _router.post('/askquestion', jwtVerification, isAllFieldsAvailable, (req, res) => {

        // find the user 
        userModel.findOne({ "email": req.decoded.email }, function(err, user) {

            if (err) {
                console.log(err);
            }

            if (!user) {
                let response = responseFormat(true, "you have to be a user of askElf to  post  any questions", 400, null);
                return res.json(response);
            }

            // question object
            let question = {

                title: req.body.title,
                question: req.body.question,
                game: req.body.game,
                postedBy: user

            }

            // create the question
            let newQuestion = new questionModel(question);
            newQuestion.save((err) => {
                if (err) {
                    console.log(err)
                }

                // save this question to user
                user.questionsAsked.push(newQuestion);
                user.save((err) => {
                    if (err) {
                        console.log(err);
                    }

                    let response = responseFormat(false, 'question successfully posted', 200, null);
                    return res.json(response);

                })

            })

        }) // end

    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end