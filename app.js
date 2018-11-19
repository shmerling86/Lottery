var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/signup', {
            templateUrl: 'signup/signup.html',
            controller: "signupCtrl"
        })

        .when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl'
        })

        .when('/new', {
            templateUrl: 'new/new.html',
            controller: 'newCtrl'
        })

        .when('/list', {
            templateUrl: 'list/list.html',
            controller: 'listCtrl'
        })

         .when('/winner', {
            templateUrl: 'win/winner.html',
            controller: 'winCtrl'
        })

        .otherwise({
            redirectTo: '/login'
        });

})