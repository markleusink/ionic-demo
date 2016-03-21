var app = angular.module('starter.controllers');

app.factory('Users', function($http, appConfig) {

  var users = [];

  return {

    all: function() {
      //retrieve all users

      return $http.get(appConfig.apiEndpoint + '/users')
      .then( function(res) {
        return res;
      });

    },

    get: function(userId) {
      //retrieve a single user

      return $http.get(appConfig.apiEndpoint + '/user/' + userId)
      .then( function(res) {
        return res.data;
      });

    }
    
  };

});