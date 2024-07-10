// newAnswer route
// edit question route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router()
const userModel = mongoose.model('userModel')
const questionModel = mongoose.model('questionModel');
const answerModel = mongoose.model('answerModel');
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

    _router.post('/newanswer', jwtVerification, (req, res) => {

        // check empty fields
        if (!req.body.questionId || !req.body.answer) {

            // SOME FIELDS ARE EMPTY
            const response = responseFormat(true, 'Alguns parâmetros de entrada estão faltando em seus campos de resposta', 400, null);
            return res.json(response);

        }

        // find the question and insert the answer
        questionModel.findById({ "_id": req.body.questionId }, function(err, question) {
            if (err) {
                console.log(err);
                return;
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
                answeredBy: req.decoded
            }

            // save the answer
            let newAnswer = new answerModel(answer);
            newAnswer.save(function(err) {
                if (err) {
                    console.log(err);
                    return
                }

                // save the reference to the useranswers field
                setTimeout(function() {
                    // find the user and save it
                    userModel.findById({ '_id': req.decoded._id }, function(err, user) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        if (!user) {
                            return
                        }

                        user.questionsAnswered.push(question);
                        user.save(function(err) {
                            if (err) {
                                console.log(err);
                            }

                            return;

                        })
                    })
                }, 0);

                // save the reference to questions answers field
                setTimeout(function() {
                    question.answers.push(newAnswer);
                    question.save(function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        return
                    })
                }, 0)

                // send mail to the person who asked this question
                setTimeout(function() {
                    console.log()
                    if (question.postedBy.toString() === req.decoded._id) {

                        return;
                    }

                    userModel.findById({ "_id": question.postedBy }, function(err, person) {
                        if (err) {
                            console.log(err);
                            return
                        }

                        if (!person) {
                            return;
                        }

                        // send the email notification

                        let mailOptions = {

                            from: "askELF",
                            to: person.email,
                            subject: "Notification From askELF",
                            text: `Outra nova resposta recebida para a pergunta intitulada ${question.title} que você respondeu antes, dê uma olhada nisso`
                        };

                        SMTP.sendMail(mailOptions, function(error, response) {
                            if (error) {
                                console.log(error);
                                return;
                            }
                            console.log(response);
                            return;
                        });
                    })

                }, 1000)



                // send mail notifications to the persons who already answered for this question
                
                setTimeout(function() {
                 return
                }, 10000)


                let response = responseFormat(false, "resposta postada com sucesso !!", 200, newAnswer);
                return res.json(response);

            });


        }) // qeustion find end

    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end