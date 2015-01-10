/**
 * Created by talwa_000 on 10/01/15.
 */
'use strict';

angular.module('mainApp').factory('authToken',['$window', function($window){
    var storage = $window.localStorage;
    var cachedToken;
    return {
        setToken: function(token){
            cachedToken = token;
            storage.setItem('userToken', token);
            window.location.replace(window.location.origin);
        },
        getToken: function(){
            if(!cachedToken)
                cachedToken = storage.getItem('userToken');
            return cachedToken;
        },
        isAuthenticated: function(){
            //take the result cast to boolean an inverse it
            return !!this.getToken();
        }
    };
    }]);