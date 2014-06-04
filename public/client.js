var securities = angular.module('securities', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$http.get('/trade/securities')
		.success(function(data) {
			$scope.secs = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createSec = function() {
		console.log('creating ' +$scope.formData.name+' ' +$scope.formData.OI+' '  +$scope.formData.bid+' '  +$scope.formData.ask )
		$http.post('/trade/securities', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.secs = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteSec = function(id) {
		$http.delete('/trade/securities/' + id)
			.success(function(data) {
				$scope.secs = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}
