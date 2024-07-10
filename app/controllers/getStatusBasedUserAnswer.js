// get all the status based user answer route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const questionModel = mongoose.model('questionModel');
const jwtVerification = require('../../customMiddlewares/jwtVerification');
const answerModel = mongoose.model('answerModel');
const userModel = mongoose.model('userModel');


module.exports = (app, responseFormat) => {

    _router.get('/statusbaseduseranswer/:status/:skip', jwtVerification, (req, res) => {

        // validate the query fields
        if (!req.params.status) {
            let response = responseFormat(true, "essa rota requer o parâmetro url de status", 400, null);
            return res.json(response);
        }

        if (!(req.params.status === "closed") && !(req.params.status === "open")) {

            let response = responseFormat(true, "seu parâmetro de url deve ter qualquer uma das opções de fechado ou aberto", 400, null);
            return res.json(response);
        }

        let query = answerModel.find({ 'answeredBy': mongoose.Types.ObjectId(req.decoded._id) });
        query.sort({ answered: -1 });
        query.skip(parseInt(req.params.skip));
        query.limit(5);

        query.populate({
            path: 'question',
            model: "questionModel",
            select: { "title": 1, "question": 1, "postedBy": 1, "posted": 1, "status": 1, "game": 1 },
            populate: {
                path: 'postedBy',
                model: "userModel",
                select: { "userName": 1, "gender": 1 }
            }
        }).exec((err, answers) => {

            if (err) {
                console.log(err);
            }

            let data = answers.filter(answer => {

                if (answer.question) {
                    if (req.params.status === answer.question.status) {
                        return answer;
                    }
                }

            })



            let response = responseFormat(false, "your answers", 200, data);
            return res.json(response);

        })



    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end