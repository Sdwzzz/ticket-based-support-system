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
            let response = responseFormat(true, 'question id is missing', 400, null);
            return res.json(response);
        }

        questionModel.findById({ '_id': req.body.questionId }, function(err, question) {
            if (err) {
                console.log(err);
            }
            if (!question) {
                let response = responseFormat(true, 'there is no question available with this questin id', 400, null);
                return res.json(response);
            }

            if (!(req.decoded._id === question.postedBy.toString())) {
                let response = responseFormat(true, 'you are not authorize to delete this question detail', 400, null);
                return res.json(response);
            }

            question.remove((err) => {
                if (err) {
                    console.log(err)
                }

                let response = responseFormat(false, 'question successfully deleted', 200, null);
                return res.json(response);

            })
        })


    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end