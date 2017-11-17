// voting for questions and answers route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const questionModel = mongoose.model("questionModel");
const answerModel = mongoose.model("answerModel");
const userModel = mongoose.model("userModel");
const jwtVerification = require('../../customMiddlewares/jwtVerification');




module.exports = (app, responseFormat) => {

    _router.post('/vote', jwtVerification, (req, res) => {

        if (!req.body.vote || !req.body.give || !req.body.voteId) {
            // some fields are empty
            const response = responseFormat(true, 'some input parameters are missing in your voting fields', 400, null);
            return res.json(response);
        }

        userModel.findOne({ "email": req.decoded.email }, function(err, user) {
            if (err) {
                console.log(err);
            }

            if (!user) {
                let response = responseFormat(true, "you have to be a user of askElf to  post  any questions", 400, null);
                return res.json(response);
            }

            // question vote

            if (req.body.vote === "question") {

                // vote for question
                //check user is already voted or not for this question
                for (let i = 0; i < user.votedQuestions.length; i++) {
                    console.log(user.votedQuestions[i].toString());
                    if (!user.votedQuestions) {
                        break;
                    }

                    console.log(user.votedQuestions[i].toString());
                    if (user.votedQuestions[i].toString() === req.body.voteId) {
                        let response = responseFormat(true, "you already voted for this question", 400, null);
                        return res.json(response);

                    }


                }



                questionModel.findById({ "_id": req.body.voteId }, (err, question) => {
                    if (err) {
                        console.log(err);
                    }
                    if (!question) {

                        const response = responseFormat(true, 'no question found with this id', 400, null);
                        return res.json(response);

                    }

                    // store the question in voted questions field
                    setTimeout(function() {
                        user.votedQuestions.push(question)
                        user.save((err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }, 0)

                    if (req.body.give === "up") {
                        question.votes++;
                        question.save((err) => {
                            if (err) {
                                console.log(err);
                            }
                            const response = responseFormat(false, 'sucessfully upvoted for this question', 200, null);
                            return res.json(response);
                        })
                    }

                    if (req.body.give === "down") {
                        question.votes--;
                        question.save((err) => {
                            if (err) {
                                console.log(err);
                            }
                            const response = responseFormat(false, 'sucessfully downvoted for this question', 200, null);
                            return res.json(response);
                        })

                    }



                })

            } // end of question vote


            // answer vote
            if (req.body.vote === "answer") {


                // vote for answer 
                //check user is already voted or not for this answer
                for (let i = 0; i < user.votedAnswers.length; i++) {

                    if (!user.votedAnswers) {
                        break;
                    }

                    if (user.votedAnswers[i].toString() === req.body.voteId) {
                        let response = responseFormat(true, "you already voted for this answer", 400, null);
                        return res.json(response);

                    }


                }

                answerModel.findById({ "_id": req.body.voteId }, (err, answer) => {
                    if (err) {
                        console.log(err);
                    }
                    if (!answer) {

                        const response = responseFormat(true, 'no answer found with this id', 400, null);
                        return res.json(response);

                    }

                    // store the question in voted questions field
                    setTimeout(function() {
                        user.votedAnswers.push(answer);
                        user.save((err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }, 0)

                    if (req.body.give === "up") {
                        answer.votes++;
                        answer.save((err) => {
                            if (err) {
                                console.log(err);
                            }
                            const response = responseFormat(false, 'sucessfully upvoted for this answer', 200, null);
                            return res.json(response);
                        })
                    }

                    if (req.body.give === "down") {
                        answer.votes--;
                        answer.save((err) => {
                            if (err) {
                                console.log(err);
                            }
                            const response = responseFormat(false, 'sucessfully downvoted for this answer', 200, null);
                            return res.json(response);
                        })

                    }





                })





            } // end of answer vote

        }) // end of user 

    }) // end of vote route


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end