nwslData
.controller('GraphsCtrl', function($scope, nwslDataService) {
  'use strict';
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