nwslData
.directive('bargraph', function (nwslDataService, $timeout) {
  'use strict';
  return {
    restrict: "AE",
    scope: {
      team: "&",
      hover: '&',
      hoverLeave: '&',
      sort: '&',
      year: "@",
      title: "@",
      sortText: "@"
    },
    controller: 'GraphsCtrl',
    templateUrl: '/js/directives/templates/bargraphtemplate.html',
    link: function (scope, element, attrs) {
      nwslDataService.getRidOfZeroes(scope.year).then(function (data) {

      var margin = {top: 20, right: 10, bottom: 120, left: 40},
          width = 950 - margin.left - margin.right,
          height = 700 - margin.top - margin.bottom;

      var teamColors = {
        boston: {
            stroke: "#004890",
            fill: "#004890"
          },
        chicago: {
            stroke: "#1BB6EC",
            fill: "#1BB6EC"
          },
        kansascity: {
            stroke: "#000",
            fill: "#000"
          },
        portland: {
            stroke:"#113B2D",
            fill: "#113B2D"
          },
        seattle: {
            stroke: "#949DA4",
            fill: "#949DA4"
          },
        jersey: {
            stroke: "#56077A",
            fill: "#56077A"
          },
        dc: {
            stroke: "#C32033",
            fill: "#C32033"
          },
        wny: {
            stroke: "#FBEE01",
            fill: "#FBEE01"
          },
        houston: {
            stroke: "#F5853D",
            fill: "#F5853D"
          }
      };

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.2);

      var y = d3.scale.linear()
        .range([height, 0]);

      var chart = d3.select("#goalscorers").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
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
          .text("Goals Scored");

      function update (data) {

        x.domain(data.map(function(d) { return d.NAME; }));
        y.domain([0, d3.max(data, function(d) { return d.G; })]);
        
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
          .duration(500)

        var bars = chart.selectAll(".bar")
          .data(data, function(d) {return d.NAME;});

        bars.transition()
          .duration(500)
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.NAME); })
          .attr("y", function(d) { return y(d.G); })
          .attr("height", function(d) { return height - y(d.G); })
          .attr("width", x.rangeBand())
          .attr("fill", function(d) {
            return teamColors[d.team].fill;
          })
          .attr("stroke", function(d) {
            return teamColors[d.team].stroke;
          });

        //enter
        bars.enter()
          .append("rect")
          .attr("width", x.rangeBand())
          .attr("class", "bar")
          .attr("x", 0)
          .attr("y", y(0))
          .attr("height", 0)
          .style("opacity", 0)
          .on('mouseover', function(d,i) {
            return scope.hover({item: d});
          })
          .on('mouseleave', function(d,i) {
            return scope.hoverLeave({item: d});
          })
          .attr("fill", function(d) {
            return teamColors[d.team].fill;
          })
          .attr("stroke", function(d) {
            return teamColors[d.team].stroke;
          })
          .transition()
            .duration(500)
            .attr("y", function(d) { return y(d.G); })
            .attr("x", function(d) { return x(d.NAME); })
            .attr("height", function(d) { return height - y(d.G); })
            .style("opacity", 0.8);

          bars.exit()
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();
      }

      update(data);

      scope.team = function(team) {
        if (team === "all") {
          update(data);
        } else {
          var filterData = [];
          data.forEach(function(elem) {
            if (elem.team === team) {
              filterData.push(elem);
            }
            return filterData;
          })

          update(filterData);
        }
      };

      scope.sortText = "Sort by Total Goals";

        var sortOrder = true;
        scope.sort = function() {
          sortOrder = !sortOrder;
          if (!sortOrder) {
          scope.sortText = "Sort by Teams";
          var x0 = x.domain(data.sort(function(a, b) { 
            if (a.G === b.G) {
            if (a.team > b.team) return 1;
            if (a.team < b.team) return -1;
            return 0;
          }
          if (a.G > b.G) return -1;
          if (a.G < b.G) return 1;
            return 0; 
          })
            .map(function(d) { return d.NAME; }))
            .copy();

          var transition = chart.transition().duration(250),
            delay = function(d, i) { return i * 10; };

          transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function(d) { return x0(d.NAME); });
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
            scope.sortText = "Sort by Total Goals";
            var x0 = x.domain(data.sort(function(a,b) {
              if (a.team === b.team) {
                if (a.G > b.G) return -1;
                if (a.G < b.G) return 1;
                return 0;
              }
              if (a.team > b.team) return 1;
              if (a.team < b.team) return -1;
                return 0;
            })
            .map(function(d) { return d.NAME; }))
            .copy();

            var transition = chart.transition().duration(250),
            delay = function(d, i) { return i * 10; };

          transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function(d) { return x0(d.NAME); });
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