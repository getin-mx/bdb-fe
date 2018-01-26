var app = angular.module('bdb');

app.controller('YesNoController', function($scope, title, body, close) {
  this.title = title;
  this.body = body;

  $scope.close = function(result) {
 	  close(result, 500); // close, but give 500ms for bootstrap to animate
  };

});
