nwslData
.controller('GraphsCtrl', function($scope, $timeout, nwslDataService) {
  'use strict';
  $scope.test = [1, 2];
  $scope.teamFilter = 'all';
  nwslDataService.getTeams(2014).then(function(data) {
    console.log("get teams");
    $scope.cities = data;
    console.log("$scope.cities in controller", $scope.cities);
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