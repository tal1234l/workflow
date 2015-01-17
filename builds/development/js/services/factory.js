'use strict';

angular.module('mainApp').factory('authToken',['$window', function($window){
    var storage = $window.localStorage;
    var cachedToken;
    var userToken = 'userToken';
    var authToken = {
        setToken: function(token){
            cachedToken = token;
            storage.setItem(userToken, token);
            authToken.isAuthenticated();
        },
        getToken: function(){
            if(!cachedToken)
                cachedToken = storage.getItem(userToken);
            return cachedToken;
        },
        isAuthenticated: function(){
            //take the result cast to boolean an inverse it
            return !!authToken.getToken();
        },
        removeToken: function(){
            cachedToken = null;
            storage.removeItem(userToken);
        }
    }

    return authToken;

}]);

angular.module('mainApp').factory('authInterceptor',['authToken', function(authToken){
    return {
        request: function(config){
            var token = authToken.getToken();
            if(token)
                config.headers.Authorization = 'Bearer ' + token;
            return config;
        },
        response: function(response){
            return response;
        }
    };
}]);
angular.module('mainApp').service('auth',['$http','API_URL','authToken','$state', function auth($http,API_URL,authToken,$state){
    function authSuccessful(res){
        authToken.setToken(res.token);
        $state.go('home');
    };
    this.login = function(email,password){
        return $http.post(API_URL + '/loginUser', {name: email, password: password})
            .success(authSuccessful);
    };
    this.register = function(email,password){
        return $http.post(API_URL + '/registerUser', {name: email, password: password})
            .success(authSuccessful);

    };
}]);