// MIDDLEWARE TO CHECK THE SIGN UP FIELDS

// DEPENDECIES
const responseFormat = require('../customLib/responseFormat');

// EXPORT
module.exports = (req, res, next) => {
    
	// CHECK ANY EMPTY FIELDS ARE PRESENT (FOR SIGNUP FIELD)
     if(req.originalUrl === '/api/signup'){

			if(!req.body.email || !req.body.userName || !req.body.password || !req.body.gender || !req.body.interestedLanguages){
				// SOME FIELDS ARE EMPTY
				const response = responseFormat(true,'some input parameters are missing in your signup fields',400,null);
				return res.json(response);
			}
      }  


     // CHECK ANY EMPTY FIELDS ARE PRESENT (FOR LOGIN FIELD)
     if(req.originalUrl === '/api/login'){

			if(!req.body.email || !req.body.password){
				// SOME FIELDS ARE EMPTY
				const response = responseFormat(true,'some input parameters are missing in your login fields',400,null);
				return res.json(response);
			}
      }
    
    // CHECK ANY EMPTY FIELDS ARE PRESENT (FOR FORGET PASSWORD)
    if(req.originalUrl === '/api/forgetpassword'){

    	if(!req.body.email){
				// SOME FIELDS ARE EMPTY
				const response = responseFormat(true,' email field is missing',400,null);
				return res.json(response);
			}

    }


    // CHECK ALL FIELDS ARE PRESENT IN POSTING QUESTION
    if(req.originalUrl === '/api/askquestion'){
    	if(!req.body.title || !req.body.question || !req.body.programmingLanguage){

    		// SOME FIELDS ARE EMPTY
				const response = responseFormat(true,'some input parameters are missing in your question fields',400,null);
				return res.json(response);
                
    	}
    }


   // CHECK ALL FIELDS ARE PRESENT IN THE ANSWER
    if(req.originalUrl === '/api/answer'){
    	if(!req.body.questionId || !req.body.answer ){

    		// SOME FIELDS ARE EMPTY
				const response = responseFormat(true,'some input parameters are missing in your answer fields',400,null);
				return res.json(response);
                
    	}
    }


	// IF ALL FIELDS ARE PRESENT THEN GO TO SIGN UP FUNCTION OR LOGIN FUNCTION (BASED ON THE REQUESTED END POINT);
     return next();
}


