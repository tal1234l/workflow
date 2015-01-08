var mainApp = angular.module('mainApp', ['ngRoute', 'ngAnimate']);

// configure our routes
mainApp.config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : '/pages/home.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : '/pages/about.html',
            controller  : 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : '/pages/contact.html',
            controller  : 'contactController'
        })
        .otherwise({ redirectTo: '/home' });
});