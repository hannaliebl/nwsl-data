nwslData
.controller('GraphsCtrl', function($scope, $timeout, getDataService, nwslDataService, graphDataService) {
  'use strict';

  $scope.goalScorers = [];

  $scope.graphData = graphDataService.data;

  $scope.$watch('graphData', function(newVal) {
    $scope.rawData = newVal.rawData;
    $scope.goalScorers = newVal.goalScorers;
    $scope.teams = newVal.teams;
    console.log(newVal);
  });

  $scope.test = [1, 2];
  nwslDataService.getTeams(2014).then(function(data) {
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

  getDataService.getRawData(2014);
});