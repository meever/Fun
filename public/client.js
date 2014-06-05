var app = angular.module('securities',[]);  //["angular-growl", "ngAnimate", "ngMockE2E"]);
//
//app.config(["growlProvider", "$httpProvider", function(growlProvider, $httpProvider) {
//	growlProvider.globalTimeToLive(2000);
//	growlProvider.messagesKey("my-messages");
//	growlProvider.messageTextKey("messagetext");
//	growlProvider.messageSeverityKey("severity-level");
//	growlProvider.onlyUniqueMessages(true);
//	$httpProvider.responseInterceptors.push(growlProvider.serverMessagesInterceptor);
//}]);


function  frontController($scope, $http) {
	// when landing on the page, get all securities and show them
	$http.get('/trade/securities/')
		.success(function(data) {
			console.log('here')
			$scope.secs = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
}

function mainController($scope, $http) {
	$scope.formData = {};
	$scope.user= window.userName
	$scope.admin= ($scope.user =="Market")
	// when landing on the page, get all securities and show them
	$http.get('/trade/securities/'+$scope.user)
		.success(function(data) {
			console.log('here')
			$scope.secs = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createSec = function() {
		$http.post('/trade/securities/'+$scope.user, $scope.formData)
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
		$http.delete('/trade/securities/'+$scope.user +'/'+ id)
			.success(function(data) {
				$scope.secs = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.fillForm = function(sec) {
		$scope.formData.name=sec[0]
		$scope.formData.OI=sec[1]
		$scope.formData.bid=sec[2]
		$scope.formData.ask=sec[3]
	};
	
	// trade a security
	$scope.tradeThis = function(sec, num) {
		var thisTrade={sec:sec, user:$scope.user, num:num}
		$http.post('/trade/one/' , thisTrade)
			.success(function(data) {
				if (typeof data == 'string' && data.slice(6)=='Error!')
					$http.alert('Error')
				else $scope.secs= data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}
