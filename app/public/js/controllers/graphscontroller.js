nwslData
.controller('GraphsCtrl', function($scope, $timeout, getDataService, nwslDataService, graphDataService) {
  'use strict';

  $scope.goalScorers = [];
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

  graphDataService.fetchData('2014');
});