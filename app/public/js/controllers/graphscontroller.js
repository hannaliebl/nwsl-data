nwslData
.controller('GraphsCtrl', function($scope, $timeout, nwslDataService) {
  'use strict';
  $scope.test = [1, 2];
  nwslDataService.getTeams(2014).then(function(data) {
    $scope.cities = data;
  });
  nwslDataService.getGoalsPerHr(2014).then(function(data) {
    console.log(data);
  });
  $scope.show = false;
  $scope.showDetail = function (item) {
    $scope.show = true;
    $scope.details = item;
  };
  $scope.hideDetail = function (item) {
    $scope.show = false;
    $scope.details = null;
  };
});