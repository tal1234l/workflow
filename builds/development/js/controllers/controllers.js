/**
 * Created by talwa_000 on 07/01/15.
 */
'use strict';

// create the controller and inject Angular's $scope
mainApp.controller('homeController',['$scope', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
    $scope.pageClass = 'page-home';
}]);

mainApp.controller('aboutController',['$scope', function($scope) {
    $scope.message = 'Look! I am an about page.';
    $scope.pageClass = 'page-about';
}]);

mainApp.controller('contactController',['$scope', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
    $scope.pageClass = 'page-contact';
}]);

mainApp.controller('loginController',['$rootScope','$scope','$http','authToken','$state', 'API_URL', function($rootScope, $scope, $http, authToken, $state, API_URL) {
    $scope.submit = function(){
        var url = API_URL + '/loginUser';
        var user = {
            name: $scope.email,
            password: $scope.password
        };
        console.log('url: '+ url);
        $http.post(url,user)
            .success(function(res){
                console.log(res);
                toastr.success('Account ' +res.user.name+' , successfully logged in');
                authToken.setToken(res.token);
                $rootScope.isAuthenticated = true;
                $state.go('home');
            })
            .error(function(err){
                toastr.error(err.message);
            });
        console.log('test');
    };
}]);

mainApp.controller('registerController',['$rootScope','$scope','$http','authToken','$state', 'API_URL', function($rootScope, $scope, $http, authToken, $state, API_URL) {
    $scope.submit = function(){
        var url = API_URL + '/registerUser';
        var user = {
            name: $scope.email,
            password: $scope.password
        };
        console.log('url: '+ url);
        $http.post(url,user).success(function(data){
                console.log(data);
                toastr.success('Account ' +data.user.name+' , successfully created');
                authToken.setToken(data.token);
                $rootScope.isAuthenticated = true;
                $state.go('home');
            })
            .error(function(err){
                toastr.error(err);
            });
        console.log('test');
    };
}]);

mainApp.controller('headerController', ['$rootScope','$scope', 'authToken','$state', function($rootScope, $scope, authToken, $state){
    $rootScope.isAuthenticated = authToken.isAuthenticated();
    $scope.logout = function(){
        authToken.removeToken();
        $rootScope.isAuthenticated = false;
        $state.go('home');
    };
}]);

mainApp.controller('identitiesController', ['$scope','$http','API_URL', function($scope, $http, API_URL){
    $http.get(API_URL + '/getIdentities')
        .success(function(res){
            console.log(res);
            $scope.identities = res;
        })
        .error(function(err){
            toastr.warning('Could not get identities','warning!');
        });
}]);
