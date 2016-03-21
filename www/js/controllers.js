angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, appConfig, $rootScope, $window, LoginFactory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.loginMessage = '';

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  //catch the event to authenticate first
  $scope.$on('authenticate', function(event, args) {

      //try to login with stored credentials
      LoginFactory.loginWithStoredCredentials()
      .then( function(loginSuccess) {
        if (loginSuccess) {
          $window.location.reload(true);
        } else {
          $scope.login();
        }
      });

  });

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {

    if (!$scope.loginData.username || !$scope.loginData.password){
      $scope.loginMessage = 'Please enter a username and password';
      return;
    }

    $scope.loading = true;

    LoginFactory.doLogin($scope.loginData.username, $scope.loginData.password)
    .then( function(loginSuccess) {

      if (loginSuccess) {
        $window.location.reload(true);
      } else {
        $scope.loginMessage = 'Please enter a valid username and password';
      }

      $scope.loading = false;
    });
   
  };
});
