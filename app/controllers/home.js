// home route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router()



module.exports = (app, responseFormat) => {

    _router.get('/home', (req, res) => {

        let response = responseFormat(false, 'Bem-vindo ao ask elf', 200, null)

        res.json(response);
    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end