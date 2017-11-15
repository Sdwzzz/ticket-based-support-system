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
            let response = responseFormat(true, 'some input field is missing', 400, null);
            return res.json(response);
        }

        questionModel.findById({ '_id': req.body.questionId }, function(err, question) {
            if (err) {
                console.log(err);
            }

            if (!question) {
                let response = responseFormat(true, 'there is no question available with this question id', 400, null);
                return res.json(response);
            }

            if (!(req.decoded._id === question.postedBy.toString())) {
                let response = responseFormat(true, 'you are not authorize to update this question detail', 400, null);
                return res.json(response);
            }

            if (req.body.status === "open") {
                question.status = "open";
                question.save(err => {
                    if (err) {
                        console.log(err);

                    }

                    let response = responseFormat(false, 'question status updated to open', 200, null);
                    return res.json(response);
                })

            } else if (req.body.status === "closed") {
                question.status = "closed";
                question.save(err => {
                    if (err) {
                        console.log(err);

                    }

                    let response = responseFormat(false, 'question status updated to closed', 200, null);
                    return res.json(response);
                })

            } else {
                let response = responseFormat(true, 'status option is wrong, use any one of the following options open or closed in your status field', 400, null);
                return res.json(response);
            }
        })

    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end