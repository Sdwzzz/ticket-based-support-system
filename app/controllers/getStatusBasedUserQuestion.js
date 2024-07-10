// get all the status based user question route
// edit question route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const questionModel = mongoose.model('questionModel');
const jwtVerification = require('../../customMiddlewares/jwtVerification');


module.exports = (app, responseFormat) => {

    _router.get('/statusbaseduserquestion/:status/:skip', jwtVerification, (req, res) => {

        // validate the query fields
        if (!req.params.status) {
            let response = responseFormat(true, "essa rota requer o parâmetro url de status", 400, null);
            return res.json(response);
        }

        if (!(req.params.status === "closed") && !(req.params.status === "open")) {

            let response = responseFormat(true, "seu parâmetro de url deve ter qualquer uma das opções de fechado ou aberto", 400, null);
            return res.json(response);
        }

        let query = questionModel.find({ 'status': req.params.status, 'postedBy': mongoose.Types.ObjectId(req.decoded._id) });

        query.sort({ posted: -1 });
        query.skip(parseInt(req.params.skip));
        query.limit(5);

        query.populate({ path: 'postedBy', model: "userModel", select: { "userName": 1, "gender": 1 } }).
        populate({
            path: 'answers',
            model: "answerModel",
            populate: {
                path: 'answeredBy',
                model: "userModel",
                select: { "userName": 1, "gender": 1 }
            }
        }).
        exec((err, questions) => {

            if (err) {
                console.log(err);
            }

            let response = responseFormat(false, "todas as perguntas baseadas em status", 200, questions);
            return res.json(response);

        })



    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end