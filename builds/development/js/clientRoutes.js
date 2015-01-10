var mainApp = angular.module('mainApp', ['ui.router','ngAnimate']);

// configure our routes
mainApp.config(function($locationProvider, $urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $stateProvider

        // route for the home page
        .state('home', {
            url:'/',
            templateUrl : '/pages/home.html',
            controller: 'homeController'
        })

        // route for the about page
        .state('about', {
            url:'/about',
            templateUrl : '/pages/about.html',
            controller: 'aboutController'
        })

        // route for the contact page
        .state('contact', {
            url:'/contact',
            templateUrl : '/pages/contact.html',
            controller: 'contactController'
        })
        // route for the login page
        .state('login', {
            url:'/',
            templateUrl : '/pages/login.html',
            controller: 'registerController'
        })
});

