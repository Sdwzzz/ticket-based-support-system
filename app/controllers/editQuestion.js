// edit question route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const jwtVerification = require('../../customMiddlewares/jwtVerification');
const userModel = mongoose.model('userModel');
const questionModel = mongoose.model('questionModel');




module.exports = (app, responseFormat) => {

    _router.post('/editquestion', jwtVerification, (req, res) => {
        // check for empty field
        if (!req.body.questionId || !req.body.updateQuestion) {
            let response = responseFormat(true, 'some input parameters are missing', 400, null);
            return res.json(response);
        }

        questionModel.findById({ "_id": req.body.questionId }, function(err, question) {
            if (err) {
                console.log(err);
            }

            if (!question) {
                let response = responseFormat(true, 'there is no question available with this question id', 400, null);
                return res.json(response);
            }



            if (!(req.decoded._id === question.postedBy.toString())) {
                let response = responseFormat(true, 'you are not authorize to delete this question detail', 400, null);
                return res.json(response);
            }


            if (req.body.updateQuestion.title !== undefined) {
                if (req.body.updateQuestion.title.length > 0) {
                    question.title = req.body.updateQuestion.title;
                } else {
                    let response = responseFormat(true, 'title should not be empty', 400, null);
                    return res.json(response);
                }

            }
            if (req.body.updateQuestion.question !== undefined) {
                if (req.body.updateQuestion.question.length > 0) {
                    question.question = req.body.updateQuestion.question;
                } else {
                    let response = responseFormat(true, 'question should not be empty', 400, null);
                    return res.json(response);
                }

            }
            if (req.body.updateQuestion.game !== undefined) {
                if (req.body.updateQuestion.game.length > 0) {
                    question.game = req.body.updateQuestion.game;

                } else {
                    let response = responseFormat(true, 'game type should not be empty', 400, null);
                    return res.json(response);
                }

            }

            question.save(err => {
                if (err) {
                    console.log(err);
                }

                let response = responseFormat(false, 'question successfully updated!!', 200, null);
                return res.json(response);

            })



        })




    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end