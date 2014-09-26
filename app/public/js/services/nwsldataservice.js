nwslData
.factory('nwslDataService', function ($http, $q) {
  'use strict';

  var getRawData = function(year) {

    var deferred = $q.defer();

    $http.get('/api/' + year + '?callback=JSON_CALLBACK').success(function (result) {
      deferred.resolve(result);
      }).error(function () {
        deferred.reject('Could not load raw NWSL data.');
      });

    return deferred.promise;
  };

  return {
    rawData: function(year) {
      return getRawData(year);
    },
    getRidOfZeroes: function(year) {
      return getRawData(year).then(function(result) {
        var goalScorers = [];
        JSON.stringify(result);
        result.forEach(function(item, index) {
          if (item.G > 0) {
            goalScorers.push(item);
          }
        });
        goalScorers.sort(function(a,b) {
          if (a.team === b.team) {
            if (a.G > b.G) return -1;
            if (a.G < b.G) return 1;
            return 0;
          }
          if (a.team > b.team) return 1;
          if (a.team < b.team) return -1;
            return 0;
        });
        return goalScorers;
      }, function(result) {
        console.log("error:" + result);
      });
    }
  };
});