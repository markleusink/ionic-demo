var app = angular.module('starter.controllers');

app.factory('Users', function($http, appConfig) {

  var users = [];

  return {

    all: function() {
      //retrieve all users

      return $http.get(appConfig.apiEndpoint + '/api.xsp/users')
      .then( function(res) {
        return res;
      })
      .error( function(res) {
        console.log(res);

      });

    },

    load : function(start, count, search) {
      return $http.get( appConfig.apiEndpoint + '/api.xsp/users?start=' + start + '&count=' + count)
      .then( function success(res) {
        return res;
      } );
    },

    get: function(userId) {
      //retrieve a single user

      return $http.get(appConfig.apiEndpoint + '/api.xsp/user/' + userId)
      .then( function(res) {
        return res.data;
      });

    },

    save : function(user) {
      var id = user['@unid'];
      return $http.patch( appConfig.apiEndpoint + '/api.xsp/user/' + user['@unid'], 
        user );
    },
    
    
  };

});

app.factory('LoginFactory', function($http, $localstorage, $rootScope, appConfig, $q) {

  //encode a JSON object as HTML form data
  function encodeFormData(obj) {
    var encodedString = '';
    for (var key in obj) {
      if (encodedString.length !== 0) {
        encodedString += '&';
      }
   
      encodedString += key + '=' + encodeURIComponent(obj[key]);
    }
    return encodedString.replace(/%20/g, '+');
  }

  return {

    loginWithStoredCredentials : function() {

      var u = $localstorage.get('username') || '';
      var p = $localstorage.get('password') || '';

      if (u.length>0 && p.length>0) {
        //try to login with the stored credentials
        return this.doLogin(u, p);
      } else {
        //no stored credentials found - return false (through a promise)
        var deferred = $q.defer();
        deferred.resolve(false);
        return deferred.promise;
      }

    },

    doLogin : function(username, password) {
      //try to authenticate a user

      return $http.post(appConfig.apiEndpoint + '?login',
      encodeFormData( {
        'Username' : username,
        'Password' : password,
        'RedirectTo' : appConfig.apiEndpoint + '/api.xsp/userStatus'
      } ),
      {
        withCredentials: true,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      })
      .then( function(res) {

        if ( res.data.isAuthenticated) {
         
          //succesful authentication
          $rootScope.currentUser = {
            name : res.data.userName
          };

          //store credentials in localStorage
          $localstorage.set('username', username);
          $localstorage.set('password', password);

          return true;
        } else {
          return false;
        }

      }, function(err){
        console.log('error while authenticating', err);
        return false;
      });

    }

  }

});

//simple factory to read from/ write to the local storeage object
app.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);