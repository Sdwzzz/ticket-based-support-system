// get question details route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const questionModel = mongoose.model('questionModel');
const userModel = mongoose.model('userModel');
const answerModel = mongoose.model('answerModel');
const jwtVerification = require('../../customMiddlewares/jwtVerification');



module.exports = (app, responseFormat) => {

    _router.get('/questiondetail/:id', jwtVerification, (req, res) => {

        let query = questionModel.findById({"_id":req.params.id});
      


        query.populate({ path: 'postedBy', model: "userModel", select: { "userName": 1, "gender": 1 } }).
        populate('answers').
        exec((err, questions) => {

            if (err) {
                console.log(err);
            }

            let response = responseFormat(false, "question details", 200, questions);
            return res.json(response);

        })





    }) // router end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end