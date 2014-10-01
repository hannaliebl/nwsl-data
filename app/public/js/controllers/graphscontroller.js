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
    // nwslDataService.getRidOfZeroes("2014").then(function(data) {
    //   $scope.testData = data;
    // });
    // $scope.sortByTotalGoals = function() {
    //   console.log("Hi");
    //   var sortItems = function (a, b) {
    //     if (sortOrder) {
    //         return a.G - b.G;
    //     }
    //     return b.G - a.G;
    //   };
    //   svg.selectAll("rect")
    //     .sort(sortItems)
    //     .transition()
    //     .delay(function (d, i) {
    //     return i * 50;
    //   })
    //     .duration(1000)
    //     .attr("x", function (d, i) {
    //     return xScale(i);
    //   });
    // };
    $scope.test = "If you can see this, Angular is working!";
  }
);