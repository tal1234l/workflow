/**
 * Created by talwa_000 on 10/01/15.
 */
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