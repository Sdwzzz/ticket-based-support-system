// ask controller
app.controller('askController', ["$http", "$location", "$cookies", function($http, $location, $cookies) {
    let self = this;
    self.data = {};
    self.message = null;
    self.loader = false;


    // check for cookies 
    if (!($cookies.get('token'))) {

        // no token redirect to login page
        $location.path('login');

        return;
    }

    self.questionHandler = function() {
        self.loader = true;
        console.log()
        if (Object.keys(self.data).length >= 3) {

            $http.post('/api/askquestion', self.data)
                .then((response) => {
                    self.loader = false;
                    if (response.data.error) {
                        self.message = response.data.message;
                    }

                    if (!response.data.error) {
                        $location.path('profile');
                    }

                })

        } else {
            self.loader = false;
            self.message = "please select the type of game";
        }

    }

}])