nwslData
.controller('Graphs2013Ctrl', function($scope, $timeout, getDataService, nwslDataService, graphDataService) {
  'use strict';

  $scope.rawData = [];
  $scope.goalScorers = [];
  $scope.cities = [];
  $scope.goalsPerHr = [];
  $scope.goalsAllowedPerGame = [];
  $scope.saves = [];
  $scope.goalsAllowed = [];
  $scope.totalFouls = [];
  $scope.yellowCards = [];
  $scope.loading = true;

  $scope.graphData = graphDataService.data;

  $scope.$watch('graphData', function(newVal) {
    $scope.rawData = newVal.rawData;
    $scope.goalScorers = newVal.goalScorers;
    $scope.cities = newVal.teams;
    $scope.goalsPerHr = newVal.goalsPerHr;
    $scope.goalsAllowedPerGame = newVal.goalsAllowedPerGame;
    $scope.saves = newVal.saves;
    $scope.goalsAllowed = newVal.goalsAllowed;
    $scope.totalFouls = newVal.totalFouls;
    $scope.yellowCards = newVal.yellowCards;
    $scope.loading = newVal.loading;
  }, true);

  graphDataService.fetchData('2013');
});