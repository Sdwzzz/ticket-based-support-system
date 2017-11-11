// profile controller
app.controller('profileController',["$http","$location",function($http,$location){
	let self = this;
	this.name = 'profile';
	self.recentQuestions = [];
	self.skip = 0;

	// request for recent questions
	$http.get('/api/profile/'+self.skip)
	.then((response)=>{
		console.log(response);

		if(response.data.error){
			$location.path('login');
		} else {
			self.recentQuestions = response.data.data;
		}

		
		
	})
	.catch((err)=>{
		console.log(err);
	})

}])// end-controller