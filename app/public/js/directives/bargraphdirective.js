nwslData
.directive('bargraph', function (nwslDataService) {
  'use strict';
  return {
    restrict: "AE",
    scope: {
      team: "&",
      hover: '&'
    },
    template: '<div id="goalscorers">Goalscorers</div>',
    link: function (scope, element, attrs) {
      nwslDataService.getRidOfZeroes("2014").then(function (data) {
        buildChart(data);
      });

      var margin = {top: 20, right: 30, bottom: 120, left: 40},
          width = 1300 - margin.left - margin.right,
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

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
        .orient("left");

      var chart = d3.select("#goalscorers").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      function buildChart (data) {
        x.domain(data.map(function(d) { return d.NAME; }));
        y.domain([0, d3.max(data, function(d) { return d.G; })]);

        chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" ;
            });

        chart.append("g")
          .attr("class", "y axis")
          .call(yAxis);

        chart.append("text")
          .attr("class", "y-label")
          .attr("text-anchor", "end")
          .attr("y", -30)
          .attr("x", -220)
          .attr("transform", "rotate(-90)")
          .text("Goals Scored");

        chart.selectAll(".bar")
          .data(data)
          .enter().append("rect")
            .on('mouseover', function(d,i) {
              return scope.hover({item: d});
            })
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
      }
    }
  };
});