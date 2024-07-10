// delete question route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const jwtVerification = require('../../customMiddlewares/jwtVerification');
const userModel = mongoose.model('userModel');
const questionModel = mongoose.model('questionModel');



module.exports = (app, responseFormat) => {

    _router.post('/deletequestion', jwtVerification, (req, res) => {

        // check for empty field
        if (!req.body.questionId) {
            let response = responseFormat(true, 'O ID da pergunta está ausente', 400, null);
            return res.json(response);
        }

        questionModel.findById({ '_id': req.body.questionId }, function(err, question) {
            if (err) {
                console.log(err);
            }
            if (!question) {
                let response = responseFormat(true, 'Não há nenhuma pergunta disponível com esse ID de pergunta', 400, null);
                return res.json(response);
            }

            if (!(req.decoded._id === question.postedBy.toString())) {
                let response = responseFormat(true, 'Você não tem autorização para excluir esta pergunta', 400, null);
                return res.json(response);
            }

            question.remove((err) => {
                if (err) {
                    console.log(err)
                }

                let response = responseFormat(false, 'pergunta excluída com sucesso', 200, null);
                return res.json(response);

            })
        })


    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end