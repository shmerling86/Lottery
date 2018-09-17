var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'home/home.html',
            controller: 'navbarCtrl'
        })

        .when('/options', {
            templateUrl: 'options/options.html',
            controller: 'newCtrl'
        })

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

        .otherwise({
            redirectTo: '/'
        });



})