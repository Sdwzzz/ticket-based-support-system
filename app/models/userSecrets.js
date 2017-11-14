// user secret model
// dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSecretSchema = Schema({
    email: { type: String },
    password: { type: String }
})


// create user secret model
mongoose.model('userSecretModel', userSecretSchema);