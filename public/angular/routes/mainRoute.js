// main route
app.config(function($routeProvider) {
    $routeProvider

        .otherwise({
            redirectTo: '/'
        })

        .when('/', {
            templateUrl: '../angular/views/home.html',
            controller: 'homeController',
            controllerAs: 'homeCtrl'
        })

        .when('/profile', {
            templateUrl: '../angular/views/profile.html',
            controller: 'profileController',
            controllerAs: 'profileCtrl'

        })
        .when('/login', {
            templateUrl: '../angular/views/login.html',
            controller: 'loginController',
            controllerAs: 'loginCtrl'
        })
        .when('/signup', {
            templateUrl: '../angular/views/signup.html',
            controller: 'signupController',
            controllerAs: 'signupCtrl'
        })
        .when('/ask', {
            templateUrl: '../angular/views/ask.html',
            controller: 'askController',
            controllerAs: 'askCtrl'
        })
        .when('/questiondetail', {
            templateUrl: '../angular/views/questionDetail.html',
            controller: 'detailController',
            controllerAs: 'detailCtrl'
        })
        .when('/userquestion', {
            templateUrl : '../angular/views/userQuestion.html',
            controller : 'userQuestionController',
            controllerAs : 'userQuestionCtrl'
        })
        .when('/useranswer', {
            templateUrl : '../angular/views/userAnswer.html',
            controller :'userAnswerController',
            controllerAs : 'userAnswerCtrl'
        })


})