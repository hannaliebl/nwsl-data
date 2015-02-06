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

  var getGoalsPerHr = function(data) {
    var _goalScorers = getRidOfNonGoalScorers(data);
    for (var i = 0; i < _goalScorers.length; i++) {
      var productivity = ((_goalScorers[i].G/_goalScorers[i].MP) * 60).toFixed(3);
      _goalScorers[i].goalsPerHr = productivity;
    }
    return generalSort(_goalScorers, "goalsPerHr");
  };

  var getGoalsAllowedPerGame = function(data) {
    var saves = [];
    JSON.stringify(data);
    data.forEach(function(item, index) {
      if (item.GAGM > 0) {
        saves.push(item);
      }
    });
    return generalSort(saves, "GAGM");
  };

  var getSaves = function(data) {
    var saves = [];
    JSON.stringify(data);
    data.forEach(function(item, index) {
      if (item.SV > 0) {
        saves.push(item);
      }
    });
    return generalSort(saves, "SV");
  };

  var getGoalsAllowed = function(data) {
    var goalsAllowed = [];
    JSON.stringify(data);
    data.forEach(function(item, index) {
      if (item.GA > 0) {
        goalsAllowed.push(item);
      }
    });
    return generalSort(goalsAllowed, "GA");
  };

  var getFoulsCommitted = function(data) {
    var foulsCommitted = [];
    JSON.stringify(data);
    data.forEach(function(item, index) {
      if (item.FC > 0) {
        foulsCommitted.push(item);
      }
    });
    return generalSort(foulsCommitted, "FC");
  };

  var getYellowCards = function(data) {
    var yellowCards = [];
    JSON.stringify(data);
    data.forEach(function(item, index) {
      if (item.YC > 0) {
        yellowCards.push(item);
      }
    });
    return generalSort(yellowCards, "YC");
  };

  var data = {
    rawData: [],
    goalScorers: [],
    teams: [],
    goalsPerHr: [],
    goalsAllowedPerGame: [],
    saves: [],
    goalsAllowed: [],
    totalFouls: [],
    yellowCards: [],
    loading: true
  };

  return {
    data: data,
    fetchData: function(year) {
      data.loading = true;
      getDataService.getRawData(year).then(function(response) {
        JSON.stringify(response);
        data.rawData = response;
        data.goalScorers = getRidOfNonGoalScorers(data.rawData);
        data.teams = getTeams(response);
        data.goalsPerHr = getGoalsPerHr(response);
        data.goalsAllowedPerGame = getGoalsAllowedPerGame(response);
        data.saves = getSaves(response);
        data.goalsAllowed = getGoalsAllowed(response);
        data.totalFouls = getFoulsCommitted(response);
        data.yellowCards = getYellowCards(response);
        data.loading = false;
      });
    }
  };
});