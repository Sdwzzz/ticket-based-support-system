// get user answer route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router()
const userModel = mongoose.model('userModel');
const questionModel = mongoose.model('questionModel');
const answerModel = mongoose.model('answerModel')
const jwtVerification = require('../../customMiddlewares/jwtVerification');


module.exports = (app, responseFormat) => {

    _router.get('/useranswer/:skip', jwtVerification, (req, res) => {

        let query = answerModel.find({ 'answeredBy': mongoose.Types.ObjectId(req.decoded._id) });

        query.sort({ answered: -1 });


        // make sure parameter is an integer
        if (!(parseInt(req.params.skip)) && !(parseInt(req.params.skip) === 0)) {

            let response = responseFormat(true, "skip parameter must be a number", 400, null);
            return res.json(response);


        }

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

            let response = responseFormat(false, "your answers", 200, answers);
            return res.json(response);

        })



    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end