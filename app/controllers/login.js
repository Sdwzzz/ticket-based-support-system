// login route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router();
const userModel = mongoose.model('userModel');
const userSecretModel = mongoose.model("userSecretModel");
const jwt = require('jsonwebtoken');
const validator = require("email-validator");
const isAllFieldsAvailable = require('../../customMiddlewares/isAllFieldsAvailable');





module.exports = (app, responseFormat) => {

    _router.post('/login', isAllFieldsAvailable, (req, res) => {

        // check requested email is a valid one
        if (!(validator.validate(req.body.email))) {
            const response = responseFormat(true, 'This is not a valid email address, try a valid one', 400, null);
            return res.json(response);
        }

        // find the user
        userModel.verifyEmail(req.body.email).then((user) => {

            if (!user) {
                // user not found
                let response = responseFormat(true, 'No user found with this email id', 400, null);
                return res.json(response);
            }



            // check the password is valid or not
            let isPasswordValid = user.verifyHash(req.body.password);

            if (!isPasswordValid) {
                // wrong password
                let response = responseFormat(true, 'provided password is not matched with the user email', 400, null);
                return res.json(response);
            }
           
            let userData = {}
            userData._id = user._id;
            userData.userName = user.userName;
            userData.gender = user.gender;
            userData.email = user.email;
           

            // user and password are ok, generate token
            const token = jwt.sign(userData, app.get('secret'), { expiresIn: 60 * 60 * 24 }); // ** validity 24 hours only **
            // assign the token in cookies
            res.cookie("token", token);

            let response = responseFormat(false, 'successfully loged into the account !!!', 200, user);
            return res.json(response);


        }) // end




    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end