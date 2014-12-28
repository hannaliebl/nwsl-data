nwslData
.directive('stackedBargraph', function (nwslDataService, $timeout) {
  'use strict';
  return {
    restrict: "AE",
    scope: {
      svgId: "@",
      labelx: "@",
      team: "&",
      hover: '&',
      hoverLeave: '&',
      sort: '&',
      title: "@",
      hoverText: "@",
      hoverText2: "@",
      sortText: "@",
      show: "=",
      showteams: "@"
    },
    templateUrl: '/js/directives/templates/stackedbargraphtemplate.html',
    link: function (scope, element, attrs) {
      nwslDataService[attrs.source](attrs.year).then(function (data) {
        var margin = {top: 20, right: 15, bottom: 120, left: 40},
          width = 950 - margin.left - margin.right,
          height = 700 - margin.top - margin.bottom;

        var teamBackgrounds = {
          "all": {
            img: "nwsl_fade.jpg"
          },
          "boston": {
            img: "boston_fade.jpg"
          },
          "chicago": {
            img: "chicago_fade.jpg"
          },
          "washington dc": {
            img: "dc_fade.jpg"
          },
          "kansas city": {
            img: "kansascity_fade.jpg"
          },
          "portland": {
            img: "portland_fade.jpg"
          },
          "seattle": {
            img: "seattle_fade.jpg"
          },
          "new jersey": {
            img: "newjersey_fade.jpg"
          },
          "western ny": {
            img: "rochester_fade.jpg"
          },
          "houston": {
            img: "houston_fade.jpg"
          }
        };

        var teamColors = {
          "boston": {
              stroke: "#004890",
              fill: "#004890"
            },
          "chicago": {
              stroke: "#1BB6EC",
              fill: "#1BB6EC"
            },
          "kansas city": {
              stroke: "#000",
              fill: "#000"
            },
          "portland": {
              stroke:"#113B2D",
              fill: "#113B2D"
            },
          "seattle": {
              stroke: "#949DA4",
              fill: "#949DA4"
            },
          "new jersey": {
              stroke: "#56077A",
              fill: "#56077A"
            },
          "washington dc": {
              stroke: "#C32033",
              fill: "#C32033"
            },
          "western ny": {
              stroke: "#FBEE01",
              fill: "#FBEE01"
            },
          "houston": {
              stroke: "#F5853D",
              fill: "#F5853D"
            }
        };

        var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], 0.2);

        var y = d3.scale.linear()
          .range([height, 0]);

        var chart = d3.select("#"+scope.svgId).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

        var xAxisG = chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")");

        var yAxisG = chart.append("g")
          .attr("class", "y-label");

        var yLabel = chart.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "end")
            .attr("y", -30)
            .attr("x", -220)
            .attr("transform", "rotate(-90)")
            .text(attrs.labely);

        function update (data) { 
          data.forEach(function(d) {
            var y0 = 0;
            d.allShots = [{player: d.NAME, name: "Shots on Goal", y0: 0, y1: d.SOG, team: d.team, totalShots: d.SH, shotsOnGoal: d.SOG}, {player: d.NAME, name: "Off Target Shots", y0: d.SOG, y1: d.SH, team: d.team, totalShots: d.SH, shotsOnGoal: d.SOG}];
          });

          x.domain(data.map(function(d) { return d[attrs.scalex]; }));
          y.domain([0, d3.max(data, function(d) { return d[attrs.scaley]; })]);
          
          xAxisG
            .transition()
            .duration(500)
            .call(xAxis);

          xAxisG
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" ;
            });

          yAxisG
            .transition()
            .duration(500)
            .call(yAxis);

          yLabel
            .transition()
            .duration(500);

          var players = chart.selectAll('.players')
            .data(data, function(d) { return d[attrs.scalex]; });

          players.transition()
            .duration(500)
            .attr("class", "players")
            .attr("transform", function(d) { return "translate(" + x(d[attrs.scalex]) + ",0)"; });
              
          players.enter()
            .append("g")
            .attr("class", "players")
            .transition()
              .duration(500)
              .attr("transform", function(d) { return "translate(" + x(d[attrs.scalex]) + ",0)"; });

          players.exit()
              .transition()
              .duration(500)
              .style("opacity", 0)
              .remove();

          var bars = players.selectAll("rect")
            .data(function(d) {return d.allShots; });

          bars.transition()
            .duration(500)
            .attr("class", "bar")
            .attr("x", function(d) { return x(d[attrs.scalex]); })
            .attr("y", function(d) {
                return y(d.y1); })
            .attr("height", function(d) { return (y(d.y0) - y(d.y1)); })
            .attr("width", x.rangeBand())
            .attr("fill", function(d) {
              if (d.name === "Shots on Goal") {
                return "rgba(0,0,0,0.5)";
              } else {
                return teamColors[d.team].fill;
              }
            })

          bars.enter()
            .append("rect")
            .attr("width", x.rangeBand())
            .attr("x", 0)
            .attr("y", y(0))
            .attr("height", 0)
            .style("opacity", 0)
            .on('mouseover', function(d,i) {
              scope.$apply(scope.hover({item: d}));
            })
            .on('mouseleave', function(d,i) {
              scope.$apply(scope.hoverLeave({item: d}));
            })
            .attr("fill", function(d) {
              if (d.name === "Shots on Goal") {
                return "rgba(0,0,0,0.5)";
              } else {
                return teamColors[d.team].fill;
              }
            })
            .transition()
              .duration(500)
              .attr("x", function(d) { return x(d[attrs.scalex]); })
              .attr("y", function(d) {
                return y(d.y1); })
              .attr("height", function(d) { return (y(d.y0) - y(d.y1)); })
              .style("opacity", 0.9);

            bars.exit()
              .transition()
              .duration(500)
              .style("opacity", 0)
              .remove();
        }

        update(data);

        scope.cityName = teamBackgrounds.all;
        scope.team = function(team) {
          if (team === "all") {
            update(data);
            scope.cityName = teamBackgrounds.all;
          } else {
            var filterData = [];
            data.forEach(function(elem) {
              if (elem.team === team) {
                filterData.push(elem);
              }
              return filterData;
            });

            update(filterData);
            scope.cityName = teamBackgrounds[team];
          }
        };

        var orig = scope.sortText;

        var sortOrder = true;
        scope.sort = function() {
          sortOrder = !sortOrder;
          if (!sortOrder) {
            scope.sortText = "Sort by Teams";
            var x0 = x.domain(data.sort(function(a, b) { 
              if (a[attrs.scaley] === b[attrs.scaley]) {
              if (a.team > b.team) return 1;
              if (a.team < b.team) return -1;
              return 0;
            }
            if (a[attrs.scaley] > b[attrs.scaley]) return -1;
            if (a[attrs.scaley] < b[attrs.scaley]) return 1;
              return 0; 
            })
              .map(function(d) { return d[attrs.scalex]; }))
              .copy();

            var transition = chart.transition().duration(250),
              delay = function(d, i) { return i * 10; };

            transition.selectAll(".bar")
              .delay(delay)
              .attr("x", function(d) { return x0(d[attrs.scalex]); });
            transition.select(".x.axis")
              .call(xAxis)
              .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", function(d) {
                  return "rotate(-65)";
              })
              .selectAll("g")
              .delay(delay);
          } else {
            scope.sortText = orig;
            var x0 = x.domain(data.sort(function(a,b) {
              if (a.team === b.team) {
                if (a[attrs.scaley] > b[attrs.scaley]) return -1;
                if (a[attrs.scaley] < b[attrs.scaley]) return 1;
                return 0;
              }
              if (a.team > b.team) return 1;
              if (a.team < b.team) return -1;
                return 0;
            })
            .map(function(d) { return d[attrs.scalex]; }))
            .copy();

            var transition = chart.transition().duration(250),
            delay = function(d, i) { return i * 10; };

            transition.selectAll(".bar")
              .delay(delay)
              .attr("x", function(d) { return x0(d[attrs.scalex]); });
            transition.select(".x.axis")
              .call(xAxis)
              .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", function(d) {
                  return "rotate(-65)";
              })
              .selectAll("g")
              .delay(delay);
          }
        };
      });
    }
  };
});