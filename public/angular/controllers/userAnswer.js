app.controller('userAnswerController', ["$http", "$location", "mainService", "$cookies", function($http, $location, mainService, $cookies) {
    let self = this;


    self.recentQuestions = [];
    self.skip = 0;
    self.questionUrl = '/api/useranswer/';
    self.profileTitle = "all answers";
    self.duplicateQuestions = [];





    self.requestAgain = function() {


        // request for recent questions
        $http.get(self.questionUrl + self.skip)
            .then((response) => {

         
                if (response.data.error) {
                    $location.path('login');
                } else {
                    self.recentQuestions = [];
                    self.duplicateQuestions = [];

                    for (let i in response.data.data) {

                        if (response.data.data[i].question === null) {

                        } else {

                            //duplicate question check
                            if(self.duplicateQuestions.indexOf(response.data.data[i].question._id) !== -1){

                            } else {
                                
                                 self.duplicateQuestions.push(response.data.data[i].question._id);
                                 self.recentQuestions.push(response.data.data[i].question);
                            }
                           
                        }
                    }

                   


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
        window.localStorage.currentStatususeranswer = 'closedQuestions';
        $('#questionEnd').hide();

        self.skip = 0;
        self.questionUrl = '/api/statusbaseduseranswer/' + status + "/";

        self.requestAgain();

    }


    self.openQuestion = function() {
        let status = 'open';
        self.stopscrolling = false;
        self.profileTitle = "open questions";
        window.localStorage.currentStatususeranswer = 'openQuestions';
        $('#questionEnd').hide();

        self.skip = 0;
        self.questionUrl = '/api/statusbaseduseranswer/' + status + "/";

        self.requestAgain();

    }

    self.allQuestion = function() {

        self.stopscrolling = false;
        self.profileTitle = "all questions";
        window.localStorage.currentStatususeranswer = 'allQuestions';
        $('#questionEnd').hide();

        self.skip = 0;
        self.questionUrl = '/api/useranswer/';

        self.requestAgain();

    }





    // check for state fo the all questions
    if (window.localStorage.currentStatususeranswer) {
        if (window.localStorage.currentStatususeranswer === 'closedQuestions') {
            self.closedQuestion()
        } else if (window.localStorage.currentStatususeranswer === 'openQuestions') {
            self.openQuestion()
        } else if (window.localStorage.currentStatususeranswer === 'allQuestions') {
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
                for (let i in response.data.data) {
                    if (response.data.data[i].question === null) {

                    } else {

                         //duplicate question check
                            if(self.duplicateQuestions.indexOf(response.data.data[i].question._id) !== -1){

                            } else {
                                
                                 self.duplicateQuestions.push(response.data.data[i].question._id);
                                 self.recentQuestions.push(response.data.data[i].question);
                            }
                    }
                }

                
            }



        })
        .catch((err) => {
            console.log(err);
        })




    // answer link handler
    self.answerLinkHandler = function(questionId) {

        // store the question id in service and redirect to answer page
        mainService.questionId = questionId;
        mainService.comeFrom = 'useranswer';
        $location.path('questiondetail');
    }



    // infinite scroll loader
    $('#infiniteLoader').hide();

    self.stopscrolling = false;


    // infinite scrolling
    $(window).scroll(function() {



        if ($(document).height() - $(window).height() - $(window).scrollTop() === 0) {

            // check if scrolling is in answer view
            if ($location.path() !== "/useranswer") {
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
                          let tempQuestions = [];
                            for (let i in response.data.data) {
                                if (response.data.data[i].question === null) {

                                } else {

                                     //duplicate question check
                            if(self.duplicateQuestions.indexOf(response.data.data[i].question._id) !== -1){

                            } else {
                               
                                 self.duplicateQuestions.push(response.data.data[i].question._id);
                                 tempQuestions.push(response.data.data[i].question);
                            }
                                  
                                }

                            }

                            self.recentQuestions = [...self.recentQuestions, ...tempQuestions];

                           

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

}])