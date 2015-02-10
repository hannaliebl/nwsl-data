var nwslData = angular.module("nwslData", ["ngRoute", "ngAnimate"])
  .config(["$routeProvider", function ($routeProvider) {
    "use strict";
    $routeProvider
      .when("/", {
        templateUrl: "./partials/graphs-2014.html",
        controller:"Graphs2014Ctrl"
      })
      .when("/2013", {
        templateUrl: "./partials/graphs-2013.html",
        controller:"Graphs2013Ctrl"
      })
      .when("/about", {
        templateUrl: "./partials/about.html",
        controller:"AboutCtrl"
      })
      .otherwise({
        redirectTo: "/"
      });
}]);