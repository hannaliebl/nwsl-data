nwslData
.controller('Graphs2013Ctrl', function($scope, nwslDataService) {
  'use strict';
  nwslDataService.getTeams(2013).then(function(data) {
    $scope.cities = data;
  });
  $scope.showDetail = function (item) {
    $scope.$apply(function () {
      if (!$scope.showDetail)
        $scope.showDetail = true;
        $scope.details = item;
    });
  };
  $scope.hideDetail = function (item) {
    $scope.$apply(function () {
      if (!$scope.hideDetail)
        $scope.hideDetail = true;
        $scope.details = null;
    });
  };
});