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

  return {
    data: {
      rawData: [],
      goalScorers: [],
      teams: [],
      loading: true
    },
    fetchData: function(year) {
      var that = this;
      that.data.loading = true;
      getDataService.getRawData(year).then(function(response) {
        JSON.stringify(response);
        that.data.rawData = response;
        that.data.goalScorers = getRidOfNonGoalScorers(that.data.rawData);
        that.data.teams = getTeams(response);
        that.data.loading = false;
      });
    }
  };
});