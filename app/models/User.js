// user model
// dependencies
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;


// user schema
let userSchema = Schema({

	userName : {type:String},
	email : {type:String},
	password : {type:String},
	gender : {type:String},
	score : {type:String},
	intrestedLanguages : [],
	questionsAsked :[{type:Schema.ObjectId, ref:"questionModel"}],
	questionsAnswered:[{type:Schema.ObjectId, ref:"questionModel"}],
    totalGifts:{type:Number}

})


// hashing the password(using schema method)
   // hash 
   userSchema.methods.createHash = function(password){
   	   return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
   }
   // verify hash
   userSchema.methods.verifyHash = function(password){
   	    return bcrypt.compareSync(password, this.password);
 }


 // duplicate email verification(using static method)
 userSchema.statics.verifyEmail = function(email){
    
    // this going to return promise resolving find user from user model
 	return this.findOne({email:email}).exec((err)=>{
 		if(err){
 			console.log(err)
 		}
 	})
 }

// create user model
mongoose.model('userModel',userSchema);

