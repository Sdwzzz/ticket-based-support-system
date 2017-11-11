// login controller 
app.controller('loginController', ['$http','$location',function($http,$location){
	let self = this;
	self.data = {}
	self.loader = false;
	self.message = null;
  this.login = true;
  self.forgetPassword = false;
  self.forgetData ={};

    this.loginHandler = function(){
           
           self.loader=true;

           $http.post('/api/login',self.data)
           .then((response)=>{
           	 self.loader = false;
           	
           	 console.log(response)
           	 if(response.data.error){
           	 	self.message = response.data.message;
           	 }
             
             if(!response.data.error){
                
                   $location.path('profile')
             }

           })
           .catch((err)=>{
           	console.log(err);
           })


    }


    this.handleForgetPassword = function(){
      self.message = null;
      self.login = false;
      self.forgetPassword = true;

    }

    this.forgetHandler = function(){

      self.loader = true;

      $http.post('/api/forgetpassword',self.forgetData)
      .then((response)=>{

        self.loader = false;
        console.log(response);
        if(response.data.error){
          self.message = response.data.message;
        } else {
          self.message = response.data.message;
          self.forgetPassword = false;
          self.login = true;
          self.forgetData.email = " ";

        }


      })
      .catch((err)=>{
        console.log(err)
      })
      
    }


}])// end login controller