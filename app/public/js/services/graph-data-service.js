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
    var goalScorers = [];
    data.forEach(function(item, index) {
      if (item.G > 0) {
        goalScorers.push(item);
      }
    });
    return generalSort(goalScorers, "G");
  };

  var getTeams = function(data) {
    var allTeams = [];
    for (var i = 0; i < data.length; i++) {
      allTeams.push(data[i].team);
    }
    var uniqueTeams = allTeams.filter(function(value, i, arr) {
      return i === arr.indexOf(value);
    });
    return uniqueTeams;
  };

  var realData = {
    rawData: [],
    goalScorers: [],
    teams: [],
    loading: true
  };

  return {
    realData: realData,
    fetchData: function(year) {
      console.log('this', this)
      realData.loading = true;
      getDataService.getRawData(year).then(function(response) {
        JSON.stringify(response);
        realData.rawData = response;
        realData.goalScorers = getRidOfNonGoalScorers(realData.rawData);
        realData.teams = getTeams(response);
        realData.loading = false;
        return realData;
      });
    }
  };
});