// question detail controller
app.controller('detailController', ['$http','mainService','$location',function($http,mainService,$location){
	let self = this;
	self.questionId = mainService.questionId;
	
	/*// check question id 
	if(!self.questionId){

        $location.path('profile');
	}*/
   
    // get question details
    $http.get("/api/questiondetail/5a066b4dca04451c5c171f59")
    .then((res)=>{
        console.log(res);
        self.questionDetail = res.data.data;
    })
    .catch((err)=>{
    	console.log(err);
    })
	
}])