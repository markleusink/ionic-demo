var app = angular.module('starter.controllers')

.controller('UsersCtrl', function($scope, Users) {

	var numPerPage = 20;

	$scope.users = [];

	$scope.range = {
		start : 0
	};

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

})

.controller('UserCtrl', function($scope, $stateParams, Users) {

	Users.get($stateParams.userId)
  	.then( function(res) {
    	$scope.user = res;
  	});

});