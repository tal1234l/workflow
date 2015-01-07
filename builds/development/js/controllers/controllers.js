/**
 * Created by talwa_000 on 07/01/15.
 */
angular.module("myApp", ['ngRoute'])
    .factory('Todos', function($http){
        $http({
             method: 'POST',
             url: '/newDID',
             data: {
                 DID: "051947464",
                 country: "Israel",
                 in_use: "false"
             }
         }).success(function(data) {
            debugger;
                return data
         })

        /*return [
            { name: 'AngularJS Directives', completed: true, note: 'add notes...' },
            { name: 'Data binding', completed: true, note: 'add notes...' },
            { name: '$scope', completed: true, note: 'add notes...' },
            { name: 'Controllers and Modules', completed: true, note: 'add notes...' },
            { name: 'Templates and routes', completed: true, note: 'add notes...' },
            { name: 'Filters and Services', completed: false, note: 'add notes...' },
            { name: 'Get started with Node/ExpressJS', completed: false, note: 'add notes...' },
            { name: 'Setup MongoDB database', completed: false, note: 'add notes...' },
            { name: 'Be awesome!', completed: false, note: 'add notes...' },
        ];*/
    })

    .controller('TodoController', ['$scope','Todos', function ($scope, Todos) {
        $scope.todos = Todos;
    }])
    .controller('TodoDetailCtrl', ['$scope', '$routeParams', 'Todos', function ($scope, $routeParams, Todos) {
        $scope.todo = Todos[$routeParams.id];
    }])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/todos.html',
                controller: 'TodoController'
            })
            .when('/:id', {
                templateUrl: '/todoDetails.html',
                controller: 'TodoDetailCtrl'
            });
    }]);