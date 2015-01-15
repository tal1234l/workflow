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

angular.module('mainApp').factory('dbservice',['$http','API_URL', function auth($http,API_URL){
    return {
        gettempdata: function(){
            $http.get(API_URL + '/get-temp')
                .success(function(data, status, headers, config) {
                    debugger;
                    var ctx = document.getElementById("myChart").getContext("2d");
                    var data = {
                        labels: data.lable,
                        datasets: [
                            {
                                label: "temperature",
                                fillColor: "rgba(151,187,205,0.2)",
                                strokeColor: "rgba(151,187,205,1)",
                                pointColor: "rgba(151,187,205,1)",
                                pointStrokeColor: "#fff",
                                pointHighlightFill: "#fff",
                                pointHighlightStroke: "rgba(151,187,205,1)",
                                data: data.temparr
                            }
                        ]
                    };

                    var options = {
                        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                        scaleBeginAtZero : true,

                        //Boolean - Whether grid lines are shown across the chart
                        scaleShowGridLines : true,

                        //String - Colour of the grid lines
                        scaleGridLineColor : "rgba(0,0,0,.05)",

                        //Number - Width of the grid lines
                        scaleGridLineWidth : 1,

                        //Boolean - Whether to show horizontal lines (except X axis)
                        scaleShowHorizontalLines: true,

                        //Boolean - Whether to show vertical lines (except Y axis)
                        scaleShowVerticalLines: true,

                        //Boolean - If there is a stroke on each bar
                        barShowStroke : true,

                        //Number - Pixel width of the bar stroke
                        barStrokeWidth : 2,

                        //Number - Spacing between each of the X value sets
                        barValueSpacing : 5,

                        //Number - Spacing between data sets within X values
                        barDatasetSpacing : 1,

                        //String - A legend template
                        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

                    };

                    Chart.defaults.global.scaleOverride = true;
                    Chart.defaults.global.scaleSteps = 30-15;
                    Chart.defaults.global.scaleStepWidth = 1;
                    Chart.defaults.global.scaleStartValue = 15;

                    var myLineChart = new Chart(ctx).Line(data, options);

                })
                .error(function(data, status, headers, config) {

                });
        },
        getcurtempdata: function(){
            return $http.get(API_URL + '/get-current-temp')
                .success(data);

        }

    };
}]);