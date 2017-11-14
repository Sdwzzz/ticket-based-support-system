// question model
// dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create question schema
const answerSchema = Schema({

    question: { type: Schema.ObjectId, ref: 'questionModel' },
    answered: { type: Date, default: Date.now() },
    answer: { type: String },
    votes: { type: Number, default: 0 },
    answeredBy: { type: Schema.ObjectId, ref: 'userModel' }

});


// create question model
mongoose.model('answerModel', answerSchema);