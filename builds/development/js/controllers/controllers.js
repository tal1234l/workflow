/**
 * Created by talwa_000 on 07/01/15.
 */


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

mainApp.controller('registerController',['$scope','$http', function($scope, $http) {
    $scope.submit = function(){
        var url ='/';
        var user = {};
        $http.post(url,user)
            .success(function(res){
                console.log("good!");
                toastr.success('you have successfully registered','Success');
            })
            .error(function(err){
                toastr.error('Could not register','Opps!');
            });
        console.log('test');
    };
}]);
