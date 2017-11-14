// signup controller
app.controller('signupController', ['$http', function($http) {
    let self = this;
    this.loader = false;
    this.message = null;
    this.data = {};

    this.signupHandler = function() {
        self.loader = true;



        if (self.data.interestedGames.length <= 0) {
            self.message = "please choose atleast one games of your choice"
            self.loader = false;
        } else {

            $http.post('/api/signup', self.data)
                .then((response) => {
                    self.loader = false;
                    console.log(response)

                    if (response.data.error) {
                        self.message = response.data.message;
                    }

                })

        }


    }




}])