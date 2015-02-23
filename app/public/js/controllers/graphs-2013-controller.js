nwslData
.controller('Graphs2013Ctrl', function ($scope, getDataService, graphDataService) {
  'use strict';

  $scope.rawData2013 = [];
  $scope.goalScorers2013 = [];
  $scope.offFrameShots2013 = [];
  $scope.cities2013 = [];
  $scope.goalsPerHr2013 = [];
  $scope.goalsAllowedPerGame2013 = [];
  $scope.saves2013 = [];
  $scope.goalsAllowed2013 = [];
  $scope.totalFouls2013 = [];
  $scope.yellowCards2013 = [];
  $scope.loading = true;

  $scope.graphData = graphDataService.data;

  $scope.$watch('graphData', function(newVal) {
    $scope.rawData2013 = newVal.rawData;
    $scope.goalScorers2013 = newVal.goalScorers;
    $scope.offFrameShots2013 = newVal.offFrameShots;
    $scope.cities = newVal.teams;
    $scope.goalsPerHr2013 = newVal.goalsPerHr;
    $scope.goalsAllowedPerGame2013 = newVal.goalsAllowedPerGame;
    $scope.saves2013 = newVal.saves;
    $scope.goalsAllowed2013 = newVal.goalsAllowed;
    $scope.totalFouls2013 = newVal.totalFouls;
    $scope.yellowCards2013 = newVal.yellowCards;
    $scope.loading = newVal.loading;
  }, true);

  graphDataService.fetchPlayerData('2013');
});