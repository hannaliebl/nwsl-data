nwslData
.factory('getDataService', function ($http, $q) {
  'use strict';

  return {
    getRawData: function(year) {

      var deferred = $q.defer();

      $http.get('/api/' + year + '?callback=JSON_CALLBACK').success(function (result) {
        deferred.resolve(result);
        }).error(function () {
          deferred.reject('Could not load raw NWSL data.');
        });
        
      return deferred.promise;
    }
  };
});