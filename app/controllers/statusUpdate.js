// status update route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const jwtVerification = require('../../customMiddlewares/jwtVerification');
const userModel = mongoose.model('userModel');
const questionModel = mongoose.model('questionModel');



module.exports = (app, responseFormat) => {

    _router.post('/statusupdate', jwtVerification, (req, res) => {

        // check for empty field
        if (!req.body.status || !req.body.questionId) {
            let response = responseFormat(true, 'algum campo de entrada está faltando', 400, null);
            return res.json(response);
        }

        questionModel.findById({ '_id': req.body.questionId }, function(err, question) {
            if (err) {
                console.log(err);
            }

            if (!question) {
                let response = responseFormat(true, 'não há nenhuma pergunta disponível com esse ID de pergunta', 400, null);
                return res.json(response);
            }

            if (!(req.decoded._id === question.postedBy.toString())) {
                let response = responseFormat(true, 'você não tem autorização para atualizar os detalhes desta pergunta', 400, null);
                return res.json(response);
            }

            if (req.body.status === "open") {
                question.status = "open";
                question.save(err => {
                    if (err) {
                        console.log(err);

                    }

                    let response = responseFormat(false, 'status da pergunta atualizado para aberto', 200, null);
                    return res.json(response);
                })

            } else if (req.body.status === "closed") {
                question.status = "closed";
                question.save(err => {
                    if (err) {
                        console.log(err);

                    }

                    let response = responseFormat(false, 'Status da pergunta atualizado para fechado', 200, null);
                    return res.json(response);
                })

            } else {
                let response = responseFormat(true, 'A opção de status está incorreta, use qualquer uma das seguintes opções aberto ou fechado em seu campo de status', 400, null);
                return res.json(response);
            }
        })

    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end