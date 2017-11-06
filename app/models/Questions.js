// question model
// dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create question schema
const questionSchema = Schema({

	title: {type:String},
	programmingLanguge:{type:String},
	question : {type:String},
	posted : {type:Date, default:Date.now()},
	answers : [{type:Schema.ObjectId, ref:"answerModel"}],
	votes : {type:Number, default:0},
	postedBy: {type:Schema.ObjectId, ref:"userModel"},
	status: {type:String, default:"open"}

});


// create question model
mongoose.model('questionModel',questionSchema);