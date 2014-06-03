var securities = angular.module('securities', []);

function mainController($scope, $http) {
	$scope.formData = {};
	$scope.user= window.userName
	$scope.admin= ($scope.user =="Market")
	// when landing on the page, get all securities and show them
	$http.get('/trade/securities/'+$scope.user)
		.success(function(data) {
			$scope.secs = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createSec = function() {
		$http.post('/trade/securities'+$scope.user, $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.secs = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a security after checking it
	$scope.deleteSec = function(id) {
		$http.delete('/trade/securities/'+$scope.user + id)
			.success(function(data) {
				$scope.secs = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	// trade a security
	$scope.tradeThis = function(sec, num) {
		var thisTrade={sec:sec, user:$scope.user, num:num}
		$http.post('/trade/one/' , thisTrade)
			.success(function(data) {
				$scope.secs = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}
