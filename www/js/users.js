var app = angular.module('starter.controllers')

.controller('UsersCtrl', function($scope, Users) {

	Users.all()
	.then( function(res) {
		$scope.users = res.data;
	});

})

.controller('UserCtrl', function($scope, $stateParams, Users) {

	Users.get($stateParams.userId)
  	.then( function(res) {
    	$scope.user = res;
  	});

});