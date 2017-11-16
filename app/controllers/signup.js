// signup route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const validator = require("email-validator");
const _router = express.Router();
const userModel = mongoose.model('userModel');
const userSecretModel = mongoose.model('userSecretModel');
const isAllFieldsAvailable = require('../../customMiddlewares/isAllFieldsAvailable');
const SMTP = require('../../config/SMTP');
const jwt = require("jsonwebtoken");


module.exports = (app, responseFormat) => {

    _router.post('/signup', isAllFieldsAvailable, (req, res) => {

        // validate the provide email address
        if (!(validator.validate(req.body.email))) {
            const response = responseFormat(true, 'This is not a valid email address, try a valid one', 400, null);
            return res.json(response);
        }


        // check the emial is already exist or not 
        userModel.verifyEmail(req.body.email).then((user) => {

            if (user) {
                // user already exist
                let response = responseFormat(true, "This email is already exist if you already signed up please try login", 400, null);
                return res.json(response);
            }

            // save the user secrets before hashing
            let secrets = new userSecretModel();
            secrets.email = req.body.email;
            secrets.password = req.body.password;

            secrets.save((err) => {
                if (err) {
                    console.log(err);
                }
            });

            // hash the password
            let newUser = new userModel();
            newUser.email = req.body.email;
            newUser.password = newUser.createHash(req.body.password);
            newUser.gender = req.body.gender;
            newUser.userName = req.body.userName;
            newUser.interestedGames = req.body.interestedGames;

            newUser.save((err) => {
                if (err) {
                    console.log(err);
                }


                // fire  welcome email to the new user
                let mailOptions = {

                    from: "askELF",
                    to: secrets.email,
                    subject: "WELCOME MESSAGE",
                    text: `hi ${req.body.userName} welcome to askELF, ask your querys and get help and also help to solve others queries too.`
                };

                SMTP.sendMail(mailOptions, function(error, response) {
                    if (error) {
                        console.log(error);

                    } else {
                        console.log(response);

                    }
                });


                let userData = {}
                userData._id = user._id;
                userData.userName = user.userName;
                userData.gender = user.gender;
                userData.email = user.email;


                // create 24 hrs valid jwt token   and set to the cookies
                const token = jwt.sign(userData, app.get('secret'), { expiresIn: 60 * 60 * 24 }); // ** validity 24 hours only **
                res.cookie('token', token);

                let response = responseFormat(false, "successfully signed up !!!", 200, token);
                return res.json(response);

            })







        }) // end



    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end