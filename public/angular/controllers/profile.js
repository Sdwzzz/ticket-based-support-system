// profile controller
app.controller('profileController', ["$http", "$location", "mainService", "$cookies", function($http, $location, mainService, $cookies) {
    let self = this;
    this.name = 'profile';
    self.recentQuestions = [];
    self.skip = 0;
    self.questionUrl = '/api/profile/';
    self.profileTitle = "all questions";
    self.preload = true;




    self.requestAgain = function() {
      
        self.preload = true;
        // request for recent questions
        $http.get(self.questionUrl + self.skip)
            .then((response) => {


                if (response.data.error) {
                    $location.path('login');
                } else {
                    self.preload = false;
                    self.recentQuestions = response.data.data;

                }



            })
            .catch((err) => {
                console.log(err);
            })

    }



    self.closedQuestion = function() {
        let status = 'closed';
        self.stopscrolling = false;
        self.profileTitle = "closed questions";
        window.localStorage.currentStatus = 'closedQuestions';
        $('#questionEnd').hide();

        self.skip = 0;
        self.questionUrl = '/api/statusbasedquestion/' + status + "/";

        self.requestAgain();

    }


    self.openQuestion = function() {
        let status = 'open';
        self.stopscrolling = false;
        self.profileTitle = "open questions";
        window.localStorage.currentStatus = 'openQuestions';
        $('#questionEnd').hide();

        self.skip = 0;
        self.questionUrl = '/api/statusbasedquestion/' + status + "/";

        self.requestAgain();

    }

    self.allQuestion = function() {

        self.stopscrolling = false;
        self.profileTitle = "all questions";
        window.localStorage.currentStatus = 'allQuestions';
        $('#questionEnd').hide();

        self.skip = 0;
        self.questionUrl = '/api/profile/';

        self.requestAgain();

    }





    // check for state fo the all questions
    if (window.localStorage.currentStatus) {
        if (window.localStorage.currentStatus === 'closedQuestions') {
            self.closedQuestion()
        } else if (window.localStorage.currentStatus === 'openQuestions') {
            self.openQuestion()
        } else if (window.localStorage.currentStatus === 'allQuestions') {
            self.allQuestion();
        }
    }
   
    // check for cookies 
    if (!($cookies.get('token'))) {

        // no token redirect to login page
        $location.path('login');

        return;
    }


    // jwt token parsing
    function parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };

    self.user = parseJwt($cookies.get('token'))
    app.user = self.user;

    // request for recent questions
    $http.get(self.questionUrl + self.skip)
        .then((response) => {


            if (response.data.error) {
                $location.path('login');
            } else {
                self.preload = false;
                self.recentQuestions = response.data.data;

            }



        })
        .catch((err) => {
            console.log(err);
        })




    // answer link handler
    self.answerLinkHandler = function(questionId) {

        // store the question id in service and redirect to answer page
        mainService.questionId = questionId;
        mainService.comeFrom = 'profile';
        $location.path('questiondetail');
    }



    // infinite scroll loader
    $('#infiniteLoader').hide();

    self.stopscrolling = false;


    // infinite scrolling
    $(window).scroll(function() {



        if ($(document).height() - $(window).height() - $(window).scrollTop() === 0) {

            // check if scrolling is in profile view
            if ($location.path() !== "/profile") {
                return;
            }


            $('#infiniteLoader').show();

            self.skip += 5;


            if (!self.stopscrolling) {


                // request for recent questions
                $http.get(self.questionUrl + self.skip)
                    .then((response) => {
                        console.log(response);
                        $('#infiniteLoader').hide();
                        if (response.data.error) {
                            $location.path('login');
                        } else {
                            console.log(response);
                            self.recentQuestions = [...self.recentQuestions, ...response.data.data];



                            if (response.data.data.length === 0) {
                                self.stopscrolling = true;
                                $('#infiniteLoader').detach();
                                $('#questionEnd').show();
                            }
                        }

                    })
                    .catch((err) => {
                        console.log(err);
                    })

            }




        }

    }) // scroll event end







}]) // end-controller