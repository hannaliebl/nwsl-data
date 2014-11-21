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

  var generalSort = function(data, measure) {
    data.sort(function(a,b) {
        if (a.team === b.team) {
          if (a[measure] > b[measure]) return -1;
          if (a[measure] < b[measure]) return 1;
          return 0;
        }
        if (a.team > b.team) return 1;
        if (a.team < b.team) return -1;
          return 0;
      });
    return data;
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
        return generalSort(goalScorers, "G");
      }, function(result) {
        console.log("error:" + result);
      });
    },
    getTeams: function(year) {
      return getRawData(year).then(function(result) {
        var allTeams = [];
        for (var i = 0; i < result.length; i++) {
          allTeams.push(result[i].team);
        }
        var uniqueTeams = allTeams.filter(function(value, i, arr) {
          return i === arr.indexOf(value);
        });
        return uniqueTeams;
      }, function(result) {
        console.log("error:" + result);
      });
    },
    getFoulsCommitted: function(year) {
      return getRawData(year).then(function(result) {
        var foulsCommitted = [];
        JSON.stringify(result);
        result.forEach(function(item, index) {
          if (item.FC > 0) {
            foulsCommitted.push(item);
          }
        });
        return generalSort(foulsCommitted, "FC");
      }, function(result) {
        console.log("error:" + result);
      });
    },
    getYellowCards: function(year) {
      return getRawData(year).then(function(result) {
        var yellowCards = [];
        JSON.stringify(result);
        result.forEach(function(item, index) {
          if (item.YC > 0) {
            yellowCards.push(item);
          }
        });
        return generalSort(yellowCards, "YC");
      }, function(result) {
        console.log("error:" + result);
      });
    },
    getRedCards: function(year) {
      return getRawData(year).then(function(result) {
        var redCards = [];
        JSON.stringify(result);
        result.forEach(function(item, index) {
          if (item.RC > 0) {
            redCards.push(item);
          }
        });
        return generalSort(redCards, "RC");
      }, function(result) {
        console.log("error:" + result);
      });
    },
    getGoalsPerHr: function(year) {
      return this.getRidOfZeroes(year).then(function(result) {
        for (var i = 0; i < result.length; i++) {
          var productivity = ((result[i].G/result[i].MP) * 60).toFixed(3);
          result[i].goalsPerHr = productivity;
        }
        return generalSort(result, "goalsPerHr");
      }, function(result) {
        console.log("error:" + result);
      });
    },
    offFrameShots: function(year) {
      return this.getRidOfZeroes(year).then(function(result) {
        for (var i = 0; i < result.length; i++) {
          var offFrameShots = result[i].SH - result[i].SOG;
          result[i].offFrameShots = offFrameShots;
        }
        return generalSort(result, "SH");
      }, function(result) {
        console.log("error:" + result);
      });
    }
  };
});