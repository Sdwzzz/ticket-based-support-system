// get user question route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router()
const userModel = mongoose.model('userModel');
const questionModel = mongoose.model('questionModel');
const jwtVerification = require('../../customMiddlewares/jwtVerification');


module.exports = (app, responseFormat) => {

    _router.get('/userquestion/:skip', jwtVerification, (req, res) => {

        let query = questionModel.find({ 'postedBy': mongoose.Types.ObjectId(req.decoded._id) });
        query.select('title question postedBy posted status game');
        query.sort({ posted: -1 });


        // make sure parameter is an integer
        if (!(parseInt(req.params.skip)) && !(parseInt(req.params.skip) === 0)) {

            let response = responseFormat(true, "skip parameter must be a number", 400, null);
            return res.json(response);


        }

        query.skip(parseInt(req.params.skip));
        query.limit(5);




        query.populate({ path: 'postedBy', model: "userModel", select: { "userName": 1, "gender": 1 } }).exec((err, questions) => {

            if (err) {
                console.log(err);
            }

            let response = responseFormat(false, "all questions", 200, questions);
            return res.json(response);

        })



    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end