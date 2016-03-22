var app = angular.module('starter.controllers')

.controller('UsersCtrl', function($scope, $rootScope, Users) {

	var numPerPage = 20;

	$scope.users = [];

	$scope.range = {
		start : 0
	};

	//reload the data if the change event was emitted
	$rootScope.$on('users:changed', function() {
	    $scope.users = [];
	    $scope.range.start = 0;
	    $scope.loadMore();
	});

	$scope.loadMore = function() {
		
		Users.load($scope.range.start, numPerPage, $scope.search)
		.then( function(res) {

			//push data into view
			for (var i=0; i<res.data.length; i++) {
				$scope.users.push(res.data[i]);
			}

			updateContentPositions( res.headers('Content-Range') );
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});

	};

	var updateContentPositions = function(range) {

		//extract the start/end/count parameters from the range header
		var c = range.substring( range.indexOf(' ')+1);
		var b = c.split('/');
		var a = b[0].split('-');

		var start = parseInt(a[0], 10);
		var end = parseInt(a[1], 10);

		$scope.range.start = end + 1;
		$scope.range.total = parseInt(b[1], 10);

	};

	$scope.deleteUser = function(user) {
		Users.delete(user['@unid'])
		.then( function() {
			$scope.$emit('users:changed');
		});

	}

})

.controller('UserCtrl', function($scope, $stateParams, Users, $state) {

	$scope.loading = false;

	Users.get($stateParams.userId)
  	.then( function(res) {
    	$scope.user = res;
  	});

	$scope.saveUser = function() {
		$scope.loading = true;
		
		Users.save($scope.user)
		.then( function(res) {
			//emit event that the data has changed, return to view
			$scope.$emit('users:changed');
			$state.go('app.users');
		});

	};

});