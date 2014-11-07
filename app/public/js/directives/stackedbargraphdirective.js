nwslData
.directive('stackedBargraph', function (nwslDataService, $timeout) {
  'use strict';
  return {
    restrict: "AE",
    scope: {
      source: "@",
      scalex: "@",
      scaley: "@",
      svgId: "@",
      labelx: "@",
      labely: "@",
      team: "&",
      hover: '&',
      hoverLeave: '&',
      sort: '&',
      year: "=",
      title: "@",
      hoverText: "@",
      sortText: "@",
      show: "="
    },
    templateUrl: '/js/directives/templates/stackedbargraphtemplate.html',
    link: function (scope, element, attrs) {
      nwslDataService.offFrameShots("2014").then(function (data) {
        console.log(data);
        var margin = {top: 20, right: 15, bottom: 120, left: 40},
          width = 950 - margin.left - margin.right,
          height = 700 - margin.top - margin.bottom;

        var teamBackgrounds = {
          "all": {
            img: "kimlittle.jpg",
            credit: "https://www.flickr.com/photos/alza06/3530677425/in/set-72157618155404356"
          },
          "boston": {
            img: "hao.jpg",
            credit: "http://www.flickr.com/photos/curoninja/2760299890/in/photolist-5cVfZq-5cQWtP-5cQWqt-5cQWoK-5cQWnn-c9aumG-c9aufQ-c9atVY-c9atTs-c9atQY-c9atGb-c9arH7-c9arD3-c9arj7-c7ows1-bnBDS6-aGRj1R-asmWsK-9LwteA-KR6q"
          },
          "chicago": {
            img: "press.jpg",
            credit: "https://www.flickr.com/photos/hermancaroan/14015891396"
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
          "rochester": {
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

        var chart = d3.select("#stacked").append("svg")
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
            .text(scope.labely);

        var color = d3.scale.ordinal()
          .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


        function update (data) {
          color.domain(d3.keys(data[0]).filter(function(key) { return key == "d.NAME"; }));

          data.forEach(function(d) {
            var y0 = 0;
            //d.allShots = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
            d.allShots = [{name: "Shots on Goal", y0: 0, y1: d.SOG, team: d.team}, {name: "Off Target Shofts", y0: d.SOG, y1: d.offFrameShots, team: d.team}];
            d.total = d.SH;
            console.log("d in foreach", d);
          });

          data.sort(function(a, b) { return b.team - a.team; });

          x.domain(data.map(function(d) { return d.NAME; }));
          y.domain([0, d3.max(data, function(d) { return d.SH; })]);
          
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

          var players = chart.selectAll('.players')
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x(d.NAME) + ",0)"; });

          var bars = players.selectAll("rect")
            .data(function(d) {return d.allShots; })
          .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("y", function(d) { 
              console.log("d in y func", d);
              console.log("y in y func", y(d.y1));
              return y(d.y1); })
            .attr("height", function(d) { return Math.abs(y(d.y0) - y(d.y1)); })
            .attr("fill", function(d) {
              return teamColors[d.team].fill;
            });

          // bars.selectAll("rect")
          //   .data(function(d) { return d.shots; })
          // .enter().append("rect")
          //   .attr("width", x.rangeBand())
          //   .attr("y", function(d) { return y(d.y1); })
          //   .attr("height", function(d) { return y(d.y0) - y(d.y1); })
          //   .style("fill", function(d) { return color(d.name); });

          // bars.transition()
          //   .duration(500)
          //   .attr("class", "bar")
          //   .attr("x", function(d) { return x(d[scope.scalex]); })
          //   .attr("y", function(d) { return y(d[scope.scaley]); })
          //   .attr("height", function(d) { return height - y(d[scope.scaley]); })
          //   .attr("width", x.rangeBand())
          //   .attr("fill", function(d) {
          //     return teamColors[d.team].fill;
          //   })
          //   .attr("stroke", function(d) {
          //     return teamColors[d.team].stroke;
          //   });

          //enter
          // bars.enter()
          //   .append("rect")
          //   .attr("width", x.rangeBand())
          //   .attr("class", "bar")
          //   .attr("x", 0)
          //   .attr("y", y(0))
          //   .attr("height", 0)
          //   .style("opacity", 0)
          //   .on('mouseover', function(d,i) {
          //     scope.$apply(scope.hover({item: d}));
          //     //return scope.hover({item: d});
          //   })
          //   .on('mouseleave', function(d,i) {
          //     scope.$apply(scope.hoverLeave({item: d}));
          //     //return scope.hoverLeave({item: d});
          //   })
          //   .attr("fill", function(d) {
          //     return teamColors[d.team].fill;
          //   })
          //   .attr("stroke", function(d) {
          //     return teamColors[d.team].stroke;
          //   })
          //   .transition()
          //     .duration(500)
          //     .attr("y", function(d) { return y(d[scope.scaley]); })
          //     .attr("x", function(d) { return x(d[scope.scalex]); })
          //     .attr("height", function(d) { return height - y(d[scope.scaley]); })
          //     .style("opacity", 0.8);

          //   bars.exit()
          //     .transition()
          //     .duration(500)
          //     .style("opacity", 0)
          //     .remove();
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
            })

            update(filterData);
            scope.cityName = teamBackgrounds[team];
          }
        };

        scope.sortText = "Sort by Total Goals";

        var sortOrder = true;
        scope.sort = function() {
          sortOrder = !sortOrder;
          if (!sortOrder) {
          scope.sortText = "Sort by Teams";
          var x0 = x.domain(data.sort(function(a, b) { 
            if (a[scope.scaley] === b[scope.scaley]) {
            if (a.team > b.team) return 1;
            if (a.team < b.team) return -1;
            return 0;
          }
          if (a[scope.scaley] > b[scope.scaley]) return -1;
          if (a[scope.scaley] < b[scope.scaley]) return 1;
            return 0; 
          })
            .map(function(d) { return d[scope.scalex]; }))
            .copy();

          var transition = chart.transition().duration(250),
            delay = function(d, i) { return i * 10; };

          transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function(d) { return x0(d[scope.scalex]); });
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
                if (a[scope.scaley] > b[scope.scaley]) return -1;
                if (a[scope.scaley] < b[scope.scaley]) return 1;
                return 0;
              }
              if (a.team > b.team) return 1;
              if (a.team < b.team) return -1;
                return 0;
            })
            .map(function(d) { return d[scope.scalex]; }))
            .copy();

            var transition = chart.transition().duration(250),
            delay = function(d, i) { return i * 10; };

          transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function(d) { return x0(d[scope.scalex]); });
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