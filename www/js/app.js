// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.constant("appConfig", {
        "apiEndpoint": "http://demo.linqed.eu/engage/ionic.nsf"
    })
// .constant("appConfig", {
//         "apiEndpoint": "/api"
//     })

.run(function($ionicPlatform, $http) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  //always send authentication with $http requests
  $http.defaults.withCredentials = true;
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })

  .state('app.users', {
      url: '/users',
      views: {
        'menuContent': {
          templateUrl: 'templates/users.html',
          controller: 'UsersCtrl'
        }
      }
  })

  .state('app.user', {
    url: '/users/:userId',
    views: {
      'menuContent': {
        templateUrl: 'templates/user.html',
        controller: 'UserCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/search');
})

.factory('dominoHttpInterceptor', function ($q, $rootScope, $location) {
    return {
        response: function (response) {

            //catch all requests to the api that return text/html: we assume that's åthe login form
            if( (response.config.url.indexOf('api')>-1 || response.config.url.indexOf('?login') > -1)
              && response.headers()['content-type'].indexOf("text/html")>-1) {
              $rootScope.$broadcast('authenticate');
              return $q.reject(response);
            }
         
            return response;
        },
        responseError: function (response) {
            return $q.reject(response);
        }
    };
})
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('dominoHttpInterceptor');
});
