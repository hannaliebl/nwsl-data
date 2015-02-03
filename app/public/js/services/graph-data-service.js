nwslData
.factory('graphDataService', function (getDataService) {
  'use strict';

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

  var getRidOfNonGoalScorers = function(data) {
    data.forEach(function(item, index) {
      if (item.G > 0) {
        goalScorers.push(item);
      }
    });
    return generalSort(goalScorers, "G");
  };

  var getTeams = function(data) {
    var allTeams = [];
    for (var i = 0; i < result.length; i++) {
      allTeams.push(result[i].team);
    }
    var uniqueTeams = allTeams.filter(function(value, i, arr) {
      return i === arr.indexOf(value);
    });
    return uniqueTeams;
  };

  var data = {
    rawData: [],
    goalScorers: [],
    teams: [],
    loading: true
  };

  return {
    data: data,
    fetchData: function(year) {
      data.loading = true;
      getDataService.getRawData(year).then(function(response) {
        JSON.stringify(result);
        data.rawData = response;
        data.goalScorers = getRidOfNonGoalScorers(year);
        data.teams = getTeams();
        data.loading = false;
      });
    }
  };
});