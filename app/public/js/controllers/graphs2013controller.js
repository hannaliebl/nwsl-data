nwslData
.controller('Graphs2013Ctrl', function($scope, $timeout, nwslDataService) {
  'use strict';
  $scope.test = [1, 2];
  nwslDataService.getTeams(2013).then(function(data) {
    $scope.cities = data;
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