var nwslData = angular.module("nwslData", ["ngRoute", "ngAnimate"])
  .config(["$routeProvider", function ($routeProvider) {
    "use strict";
    $routeProvider
      .when("/", {
        templateUrl: "./partials/graphs.html",
        controller:"GraphsCtrl"
      })
      .when("/about", {
        templateUrl: "./partials/about.html",
        controller:"ContactCtrl"
      })
      .otherwise({
        redirectTo: "/"
      });
}]);