// question detail controller
app.controller('detailController', ['$http', 'mainService', '$location', '$timeout',"$cookies", function($http, mainService, $location, $timeout,$cookies) {
    let self = this;
    self.questionId = mainService.questionId;
    self.data = {};
    self.data.questionId = mainService.questionId;
    self.user = false;
    self.notify = false;
    self.notification = null;
    self.editdata = {};


    // check for cookies 
    if(!($cookies.get('token'))){
        
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

    // store the question id in window localstorage
    if(self.questionId){
      window.localStorage.questionId = self.questionId;
    }

    

    // scroll the window to top
    $(window).scrollTop(0);

    // check the question id from localstorage
    if(window.localStorage.questionId){
      self.questionId =  window.localStorage.questionId;
      mainService.questionId = window.localStorage.questionId;
      self.data.questionId = mainService.questionId;
    }

    // check question id 
    if (!self.questionId) {

        $location.path('profile');
    }

    // get question details
    $http.get("/api/questiondetail/" + self.questionId)
        .then((res) => {
            console.log(res);
            self.questionDetail = res.data.data;

            self.answers = self.questionDetail.answers;

            //check the user is the owner of the question
            if (app.user._id === self.questionDetail.postedBy._id) {
                self.user = true;
            }

            // change the status of the toggle button based on the question status
            if (self.questionDetail.status === "closed") {
                $(".switch").find("input[type=checkbox]").prop('checked', false)
            } else {
                $(".switch").find("input[type=checkbox]").prop('checked', true);
            }





        })
        .catch((err) => {
            console.log(err);
        })


    // answer the question

    self.answerHandler = function() {


        console.log(self.data);
        $http.post('/api/answer', self.data)
            .then(res => {
                if (!res.data.error) {
                    let newAnswer = {}
                    newAnswer.answered = new Date();
                    newAnswer.answer = self.data.answer;
                    newAnswer.votes = 0;
                    newAnswer.answeredBy = {};
                    newAnswer.answeredBy.userName = app.user.userName;
                    newAnswer.answeredBy.gender = app.user.gender;

                    self.answers.push(newAnswer);

                    //clear the answer text area
                    self.data.answer = " ";
                }

            })
            .catch(err => {
                console.log(err);
            })
    }


    self.upvote = function() {
        let data = {}
        data.vote = "question";
        data.give = "up";
        data.voteId = mainService.questionId;

        $http.post('api/vote', data)
            .then(res => {
                console.log(res);

                if (!res.data.error) {
                    self.questionDetail.votes++
                }
            })
            .catch(err => {
                console.log(err);
            })
    }



    self.downvote = function() {

        let data = {}
        data.vote = "question";
        data.give = "down";
        data.voteId = mainService.questionId;

        $http.post('api/vote', data)
            .then(res => {
                console.log(res);
                if (!res.data.error) {
                    self.questionDetail.votes--
                }
            })
            .catch(err => {
                console.log(err);
            })
    }



    self.downvoteAnswer = function(answerId, $index) {

        console.log()

        let data = {}
        data.vote = "answer";
        data.give = "down";
        data.voteId = answerId;

        $http.post('api/vote', data)
            .then(res => {
                console.log(res);
                if (!res.data.error) {
                    self.answers[$index].votes--
                }
            })
            .catch(err => {
                console.log(err);
            })

    }


    self.upvoteAnswer = function(answerId, $index) {

        let data = {}
        data.vote = "answer";
        data.give = "up";
        data.voteId = answerId;

        $http.post('api/vote', data)
            .then(res => {
                console.log(res);
                if (!res.data.error) {
                    self.answers[$index].votes++
                }
            })
            .catch(err => {
                console.log(err);
            })
    }


    // delete question
    self.deleteQuestion = function() {
        let data = {};
        data.questionId = self.questionId;

        $http.post('/api/deletequestion', data)
            .then(res => {
                console.log(res);
                if (res.data.error) {
                    self.notification = res.data.message;
                    self.notify = true;
                    $timeout(() => {

                        self.notify = false;
                    }, 1500)
                } else {
                    self.notification = res.data.message;
                    self.notify = true;
                    $timeout(() => {

                        self.notify = false;
                        $location.path('profile');
                    }, 1500)
                }

            })
            .catch(err => {
                console.log(err);
            })


    }




    // status change 
    $(".switch").find("input[type=checkbox]").on("change", function() {
        let status = $(this).prop('checked');

        console.log(status);
        let data = {};
        data.questionId = self.questionId;
        if (status) {
            data.status = 'open'
            self.questionDetail.status = "open"
        } else {
            data.status = "closed";
            self.questionDetail.status = "closed"
        }
        // make a status chang request
        $http.post('/api/statusupdate', data)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })


    });



    // edit form
    $("#edit").click(function() {

        // fill the edit data field
        self.editdata.title = self.questionDetail.title;
        self.editdata.question = self.questionDetail.question;
        self.editdata.game = self.questionDetail.game;

        $("#editForm").toggle("slow");
    })

    $("#editCancel").click(function(){
       $('#editForm').toggle("slow");

    });

    self.editHandler = function() {
        let data = {}
        data.updateQuestion = self.editdata;
        data.questionId = self.questionId;
        
        $http.post('/api/editquestion', data)
            .then(res => {
                // update question in current view
                if(!res.data.error){
                  self.questionDetail.title = self.editdata.title;
                  self.questionDetail.question = self.editdata.question;
                  self.questionDetail.game = self.editdata.game;

                  $('#editForm').toggle("slow");
                }
            })
            .catch(err => {
                console.log(err);
            })


    }

  // delete the answer
  self.deleteAnswer = function($index){
      console.log($index);

      let data = {}
      data.answerId = self.questionDetail.answers[$index]._id;
      
      $http.post('/api/deleteanswer', data)
      .then(res =>{
        if(!res.data.error){
          self.answers.splice($index,1);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }


  self.isUserAnswer = function($index){
    let userId = self.questionDetail.answers[$index].answeredBy._id;
    let currentUser = app.user._id;
    return (userId === currentUser);
  }


}])