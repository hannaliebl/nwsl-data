nwslData
.factory('getDataService', function ($http, $q) {
  'use strict';

  return {
    getRawPlayerData: function(year) {

      var deferred = $q.defer();

      $http.get('/api/player/' + year + '?callback=JSON_CALLBACK').success(function (result) {
        deferred.resolve(result);
        }).error(function () {
          deferred.reject('Could not load raw NWSL player data.');
        });

      return deferred.promise;
    },
    getRawTeamData: function(year) {

      var deferred = $q.defer();

      $http.get('/api/team/' + year + '?callback=JSON_CALLBACK').success(function (result) {
        deferred.resolve(result);
        }).error(function () {
          deferred.reject('Could not load raw NWSL team data.');
        });

      return deferred.promise;
    }
  };
});