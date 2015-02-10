nwslData
.controller('Graphs2014Ctrl', function ($scope, getDataService, graphDataService) {
  'use strict';

  $scope.rawData2014 = [];
  $scope.goalScorers2014 = [];
  $scope.offFrameShots2014 = [];
  $scope.cities2014 = [];
  $scope.goalsPerHr2014 = [];
  $scope.goalsAllowedPerGame2014 = [];
  $scope.saves2014 = [];
  $scope.goalsAllowed2014 = [];
  $scope.totalFouls2014 = [];
  $scope.yellowCards2014 = [];
  $scope.loading2014 = true;

  $scope.graphData = graphDataService.data;

  $scope.$watch('graphData', function(newVal) {
    $scope.loading2014 = newVal.loading;
    $scope.rawData2014 = newVal.rawData;
    $scope.goalScorers2014 = newVal.goalScorers;
    $scope.offFrameShots2014 = newVal.offFrameShots;
    $scope.cities = newVal.teams;
    $scope.goalsPerHr2014 = newVal.goalsPerHr;
    $scope.goalsAllowedPerGame2014 = newVal.goalsAllowedPerGame;
    $scope.saves2014 = newVal.saves;
    $scope.goalsAllowed2014 = newVal.goalsAllowed;
    $scope.totalFouls2014 = newVal.totalFouls;
    $scope.yellowCards2014 = newVal.yellowCards;
  }, true);

  graphDataService.fetchData('2014');
});