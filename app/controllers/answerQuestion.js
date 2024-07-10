// answer route hahaha
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const userModel = mongoose.model("userModel");
const questionModel = mongoose.model("questionModel");
const answerModel = mongoose.model("answerModel");
const isAllFieldsAvailable = require('../../customMiddlewares/isAllFieldsAvailable');
//const SMTP = require('../../config/SMTP');
const jwtVerification = require('../../customMiddlewares/jwtVerification');

// SMTP server configuration file
// dependencies
const nodemailer = require("nodemailer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// smtp configuration
const SMTP = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "coolnuke477@gmail.com",
        pass: "badboy333"
    }
});



module.exports = (app, responseFormat) => {

    _router.post('/answer', jwtVerification, isAllFieldsAvailable, (req, res) => {

        userModel.findOne({ "email": req.decoded.email }, function(err, user) {

            if (err) {
                console.log(err);
            }

            if (!user) {
                let response = responseFormat(true, "Você precisa ser um usuário do askElf para publicar a resposta de qualquer perguntas", 400, null);
                return res.json(response);
            }

            questionModel.findById({ "_id": req.body.questionId }, function(err, question) {

                if (err) {
                    console.log(err);
                }



                if (!question) {
                    let response = responseFormat(true, "Não há perguntas disponíveis para esse ID de pergunta", 400, null);
                    return res.json(response);
                }

                // check the status of the question
                if (question.status === "closed") {
                    let response = responseFormat(true, "esta questão foi resolvida ou encerrada ", 400, null);
                    return res.json(response);
                }

                // create answer for this question
                let answer = {
                    question: question,
                    answer: req.body.answer,
                    answeredBy: user
                }

                // send notification to all the users who already answered for this question
                if (question.answers.length > 0) {
                    let previousAnswers = question.answers;

                    setTimeout(function() {
                        console.log('i m herre ==========')
                        let ids = []
                        // loop through all the answers and find the person who posted answers and send the notification about the new answer for the question
                        for (let i = 0; i < previousAnswers.length; i++) {


                            answerModel.findById({ "_id": previousAnswers[i] }, (err, answer) => {

                                if (err) {
                                    console.log(err)
                                }
                                if (!answer) {
                                    return;
                                }

                                if (!answer.answeredBy) {
                                    return;
                                }

                                if (answer.answeredBy.toString() === req.decoded._id) {
                                    return;
                                }
                                //check for repeatation to same user

                                if (ids.indexOf(answer.answeredBy.toString()) !== -1) {

                                    return;
                                }


                                if (ids.indexOf(answer.answeredBy.toString()) === -1) {
                                    ids.push(answer.answeredBy.toString());
                                }



                                userModel.findById({ "_id": answer.answeredBy }, (err, user) => {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }

                                    let mailOptions = {

                                        from: "askELF",
                                        to: user.email,
                                        subject: "Notificação da askELF",
                                        text: `Outra nova resposta recebida para a pergunta intitulada ${question.title} que você respondeu antes, dê uma olhada nisso`
                                    };

                                    SMTP.sendMail(mailOptions, function(error, response) {
                                        if (error) {
                                            console.log(error);
                                            return;

                                        } else {

                                            console.log(response);
                                            return;

                                        }
                                    });


                                })

                            })
                        }

                        ids = [];

                    }, 0)
                }



                let newAnswer = new answerModel(answer);
                newAnswer.save((err) => {
                    if (err) {
                        console.log(err);
                    }

                    question.answers.push(newAnswer);
                    question.save((err) => {
                        if (err) {
                            console.log(err);
                        }
                        user.questionsAnswered.push(question);

                        user.save((err) => {
                            if (err) {
                                console.log(err);
                            }





                            setTimeout(function() {

                                userModel.findById({ "_id": question.postedBy }, function(err, user) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    if (!user) {
                                        return;
                                    }

                                    if (user.email === req.decoded.email) {
                                        return;
                                    }

                                    // send notification to the person who asked this question
                                    let mailOptions = {

                                        from: "askELF",
                                        to: user.email,
                                        subject: "Sua pergunta recebeu uma resposta",
                                        text: `sua pergunta intitulada ${question.title} recebeu uma resposta, vá até lá e dê uma olhada`
                                    };

                                    SMTP.sendMail(mailOptions, function(error, response) {
                                        if (error) {
                                            console.log(error);
                                            return;

                                        } else {
                                            console.log(response);
                                            return;

                                        }
                                    });


                                })





                            }, 0);





                            let response = responseFormat(false, "resposta postada com sucesso !!", 200, newAnswer);
                            return res.json(response);
                        })

                        return;
                    })

                    return;
                })

                return;
            }) // end
            return;
        }) // end


    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end