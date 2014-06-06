var app = angular.module('frontpage',['timer']); 

function timeParser(d){
	return ({year: d.getFullYear() , month: d.getMonth(), day: d.getDay(),
		hour: d.getHours(), min: d.getMinutes(), sec: d.getSeconds()})
}

function  frontController($scope, $http) {
	// when landing on the page, get all securities and show them
	var d=new Date()
	var d2=timeParser(d)
	var start=new Date(d2.year, d2.month, d2.day+1, 9,30)
	var end= new Date(d2.year, d2.month, d2.day+1, 16,00)
	console.log(start, end, d)
	if (d< start || d>end) {
		$scope.marketClosed= true;
	}else {
		$scope.mktEnd= end
		$scope.timerRunning = true;
	}

    
	$http.get('/trade/securities/')
		.success(function(data) {
			$scope.secs = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
}

