// ask controller
app.controller('askController',["$http", function($http){
	let self = this;
	self.data = {};
	self.message = null;
	self.loader = false;
	
	self.questionHandler = function(){
		self.loader = true;
		console.log()
		if(Object.keys(self.data).length>=3){
            
            $http.post('/api/askquestion',self.data)
            .then((response)=>{
            	self.loader = false;
            	if(response.data.error){
            		self.message = response.data.message;
            	}
            })

		} else {
			self.loader = false;
			self.message = "please select the type of game";
		}

	}

}])
