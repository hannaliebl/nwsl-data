nwslData
.directive('doughnutChart', function (barGraphAppearance) {
  'use strict';
  return {
    restrict: "AE",
    scope: {
      data: "=",
      loading: "=",
      svgId: "@",
      title: "@",
      measure: "@",
      update: "&",
      hoverText: "@",
      hoverText2: "@"
    },
    templateUrl: '/js/directives/templates/doughnut-chart-template.html',
    controller: function ($scope) {
      $scope.show = false;
      $scope.showDetail = function (item) {
        $scope.show = true;
        $scope.details = item;
        $scope.activeClass = item.item.data;
      };
      $scope.hideDetail = function (item) {
        $scope.show = false;
        $scope.details = null;
        $scope.activeClass = null
      };
    },
    link: function (scope, element, attrs) {

      function appendCenterLegend(element, percentageOfTotal) {
        var center = element.find('.center-group');
        center.empty();

        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '0.35em');
        text.setAttribute('class', 'doughnut-center-percentage');
        text.textContent = percentageOfTotal;

        center.append(text);
      }

      scope.emptyChartResults = false;
      var dataset = scope.data;
      var width = parseInt(d3.select(element.children().children()[1]).style('width'));
      var ratio = 1;
      var height = width * ratio;
      var radius = Math.min(width, height) / 2;
      var duration = 750;

      var pie = d3.layout.pie()
        .value(function(d) { return d[scope.measure]; } )
        .sort(null);

      var arc = d3.svg.arc()
        .innerRadius(radius - (width * 0.33))
        .outerRadius(radius - (width * 0.15));

      var svg = d3.select(element.children().children()[1]).append('svg')
        .attr('width', width)
        .attr('height', height);

      var arcGroup = svg.append('svg:g')
        .attr('class', 'arc-group')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      var centerGroup = svg.append('svg:g')
        .attr('class', 'center-group')
        .attr('ng-class', '{"active": labelShow}')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

      function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }

      scope.legendHover = function(d) {
        scope.activeClass = d;
        appendCenterLegend(element, d.team);
      };

      scope.legendHoverOff = function(d) {
        scope.activeClass = null;
        element.find('.center-group text').empty();
      };

      function update(data) {
        var arcs = arcGroup.selectAll('path')
          .data(pie(data), function(d) { return d.data[scope.measure]; });
        arcs.enter().append('svg:path')
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .attr('fill', function(d) {
           return barGraphAppearance().teamColors[d.data.team].fill;
         })
          .attr('d', arc)
          .each(function(d) { this._current = d; } )
          .on('mouseover', function(d, i) {
            d3.select(this).style({opacity:'0.9', cursor:'pointer'});
            scope.$apply(scope.showDetail({item: d}));
            appendCenterLegend(element, d.data.percentageOfTotal);
          })
          .on('mouseleave', function(d, i) {
            d3.select(this).style({opacity:1});
            scope.$apply(scope.hideDetail({item: d}));
            element.find('.center-group text').empty();
          });
        arcs.transition().duration(duration).attrTween('d', arcTween);
        arcs.exit().transition().duration(duration).style('opacity', 0).remove();
      }

      scope.$watch('data', function(newVal) {
        if (newVal !== null || newVal !== undefined || newVal !== []) {
          update(newVal);
        }
      });



      // var margin = {top: 20, right: 15, bottom: 120, left: 40},
      //   width = 950 - margin.left - margin.right,
      //   height = 700 - margin.top - margin.bottom;

      // var x = d3.scale.ordinal()
      //   .rangeRoundBands([0, width], 0.2);

      // var y = d3.scale.linear()
      //   .range([height, 0]);

      // var chart = d3.select(element[0].querySelector('.stacked-bargraph-svg-container')).append("svg")
      //   .attr("width", width + margin.left + margin.right)
      //   .attr("height", height + margin.top + margin.bottom)
      //   .append("g")
      //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // var xAxis = d3.svg.axis()
      //   .scale(x)
      //   .orient("bottom");

      // var yAxis = d3.svg.axis()
      //   .scale(y)
      //   .orient("left");

      // var xAxisG = chart.append("g")
      //   .attr("class", "x axis")
      //   .attr("transform", "translate(0," + height + ")");

      // var yAxisG = chart.append("g")
      //   .attr("class", "y-label");

      // var yLabel = chart.append("text")
      //     .attr("class", "y-label")
      //     .attr("text-anchor", "end")
      //     .attr("y", -30)
      //     .attr("x", -220)
      //     .attr("transform", "rotate(-90)")
      //     .text(attrs.labely);

      // function update (data) {
      //   data.forEach(function(d) {
      //     var y0 = 0;
      //     d.allShots = [{player: d.NAME, name: "Shots on Goal", y0: 0, y1: d.SOG, team: d.team, totalShots: d.SH, shotsOnGoal: d.SOG}, {player: d.NAME, name: "Off Target Shots", y0: d.SOG, y1: d.SH, team: d.team, totalShots: d.SH, shotsOnGoal: d.SOG}];
      //   });

      //   x.domain(data.map(function(d) { return d[attrs.scalex]; }));
      //   y.domain([0, d3.max(data, function(d) { return d[attrs.scaley]; })]);

      //   xAxisG
      //     .transition()
      //     .duration(500)
      //     .call(xAxis);

      //   xAxisG
      //     .selectAll("text")
      //     .style("text-anchor", "end")
      //     .attr("dx", "-.8em")
      //     .attr("dy", ".15em")
      //     .attr("transform", function(d) {
      //         return "rotate(-65)" ;
      //     });

      //   yAxisG
      //     .transition()
      //     .duration(500)
      //     .call(yAxis);

      //   yLabel
      //     .transition()
      //     .duration(500);

      //   var players = chart.selectAll('.players')
      //     .data(data, function(d) { return d[attrs.scalex]; });

      //   players.transition()
      //     .duration(500)
      //     .attr("class", "players")
      //     .attr("transform", function(d) { return "translate(" + x(d[attrs.scalex]) + ",0)"; });

      //   players.enter()
      //     .append("g")
      //     .attr("class", "players")
      //     .transition()
      //       .duration(500)
      //       .attr("transform", function(d) { return "translate(" + x(d[attrs.scalex]) + ",0)"; });

      //   players.exit()
      //       .transition()
      //       .duration(500)
      //       .style("opacity", 1)
      //       .remove();

      //   var bars = players.selectAll("rect")
      //     .data(function(d) {return d.allShots; });

      //   bars.transition()
      //     .duration(500)
      //     .attr("class", "bar")
      //     .attr("x", function(d) { return x(d[attrs.scalex]); })
      //     .attr("y", function(d) {
      //         return y(d.y1); })
      //     .attr("height", function(d) { return (y(d.y0) - y(d.y1)); })
      //     .attr("width", x.rangeBand())
      //     .attr("fill", function(d) {
      //       if (d.name === "Shots on Goal") {
      //         return "rgba(0,0,0,0.5)";
      //       } else {
      //         return barGraphAppearance().teamColors[d.team].fill;
      //       }
      //     });

      //   bars.enter()
      //     .append("rect")
      //     .attr("width", x.rangeBand())
      //     .attr("x", 0)
      //     .attr("y", y(0))
      //     .attr("height", 0)
      //     .style("opacity", 1)
      //     .on('mouseover', function(d,i) {
      //       scope.$apply(scope.showDetail({item: d}));
      //     })
      //     .on('mouseleave', function(d,i) {
      //       scope.$apply(scope.hideDetail({item: d}));
      //     })
      //     .attr("fill", function(d) {
      //       if (d.name === "Shots on Goal") {
      //         return "rgba(0,0,0,0.5)";
      //       } else {
      //         return barGraphAppearance().teamColors[d.team].fill;
      //       }
      //     })
      //     .transition()
      //       .duration(500)
      //       .attr("x", function(d) { return x(d[attrs.scalex]); })
      //       .attr("y", function(d) {
      //         return y(d.y1); })
      //       .attr("height", function(d) { return (y(d.y0) - y(d.y1)); })
      //       .style("opacity", 0.9);

      //     bars.exit()
      //       .transition()
      //       .duration(500)
      //       .style("opacity", 1)
      //       .remove();
      // }

      // update(scope.data);

      // scope.cityName = barGraphAppearance().teamBackgrounds.all;
      // scope.team = function(team) {
      //   if (team === "all") {
      //     update(scope.data);
      //     scope.cityName = barGraphAppearance().teamBackgrounds.all;
      //   } else {
      //     var filterData = [];
      //     scope.data.forEach(function(elem) {
      //       if (elem.team === team) {
      //         filterData.push(elem);
      //       }
      //       return filterData;
      //     });

      //     update(filterData);
      //     scope.cityName = barGraphAppearance().teamBackgrounds[team];
      //   }
      // };

      // var orig = scope.sortText;

      // var sortOrder = true;
      // scope.sort = function() {
      //   var transition = chart.transition().duration(250),
      //     delay = function(d, i) { return i * 10; };
      //   sortOrder = !sortOrder;
      //   if (!sortOrder) {
      //     scope.sortText = "Sort by Teams";
      //     var x0 = x.domain(scope.data.sort(function(a, b) {
      //       if (a[attrs.scaley] === b[attrs.scaley]) {
      //       if (a.team > b.team) return 1;
      //       if (a.team < b.team) return -1;
      //       return 0;
      //     }
      //     if (a[attrs.scaley] > b[attrs.scaley]) return -1;
      //     if (a[attrs.scaley] < b[attrs.scaley]) return 1;
      //       return 0;
      //     })
      //       .map(function(d) { return d[attrs.scalex]; }))
      //       .copy();

      //     transition.selectAll(".players")
      //       .delay(delay)
      //       .attr("transform", function(d) { return "translate(" + x(d[attrs.scalex]) + ",0)"; });
      //     transition.selectAll(".bar")
      //       .delay(delay)
      //       .attr("x", function(d) { return x0(d[attrs.scalex]); });
      //     transition.select(".x.axis")
      //       .call(xAxis)
      //       .selectAll("text")
      //       .style("text-anchor", "end")
      //       .attr("dx", "-.8em")
      //       .attr("dy", ".15em")
      //       .attr("transform", function(d) {
      //           return "rotate(-65)";
      //       })
      //       .selectAll("g")
      //       .delay(delay);
      //   } else {
      //     scope.sortText = orig;
      //     var x1 = x.domain(scope.data.sort(function(a, b) {
      //       if (a.team === b.team) {
      //         if (a[attrs.scaley] > b[attrs.scaley]) return -1;
      //         if (a[attrs.scaley] < b[attrs.scaley]) return 1;
      //         return 0;
      //       }
      //       if (a.team > b.team) return 1;
      //       if (a.team < b.team) return -1;
      //         return 0;
      //     })
      //     .map(function(d) { return d[attrs.scalex]; }))
      //     .copy();

      //     transition.selectAll(".players")
      //       .delay(delay)
      //       .attr("transform", function(d) { return "translate(" + x(d[attrs.scalex]) + ",0)"; });
      //     transition.selectAll(".bar")
      //       .delay(delay)
      //       .attr("x", function(d) { return x1(d[attrs.scalex]); });
      //     transition.select(".x.axis")
      //       .call(xAxis)
      //       .selectAll("text")
      //       .style("text-anchor", "end")
      //       .attr("dx", "-.8em")
      //       .attr("dy", ".15em")
      //       .attr("transform", function(d) {
      //           return "rotate(-65)";
      //       })
      //       .selectAll("g")
      //       .delay(delay);
      //   }
      // };
      scope.$watch('data', function (newVal) {
        update(newVal);
      });
    }
  };
});