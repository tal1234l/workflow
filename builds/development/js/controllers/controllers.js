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
mainApp.controller('loginController',['$rootScope','$scope','auth', function($rootScope, $scope,auth) {
    $scope.submit = function(){
        auth.login($scope.email,$scope.password)
            .success(function(res){
                toastr.success('Account ' +res.user.name+' , successfully logged in');
                $rootScope.isAuthenticated = true;
            })
            .error(function(err){
                toastr.error(err);
            });
    };
}]);
mainApp.controller('registerController',['$rootScope','$scope','auth', function($rootScope, $scope, auth) {
    $scope.submit = function(){
        auth.register($scope.email,$scope.password)
            .success(function(res){
                toastr.success('Account ' +res.user.name+' , successfully created');
                $rootScope.isAuthenticated = true;
            })
            .error(function(err){
                toastr.error(err);
            });
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
            toastr.warning(err.message);
        });
}]);
