'use strict';

var React = require('react/addons');
var d3 = require('d3')

require('styles/Chart.sass');

var Chart = React.createClass({

  render: function () {
    return (
        <div className="chart">
          <div id="le-chart">
            <svg ref="le-svg"></svg>
          </div>
        </div>
      );
  },

  componentDidMount: function(){
    //DATA
    var ds = this.props.data.set
    //object to list of points
    var points = Object.keys(ds).map(k => new Object({year: d3.time.format("%Y").parse(k), val: +ds[k]}))

    //SIZES
    var [width, height] = [800, 300]
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    drawingWidth = width - margin.left - margin.right,
    drawingHeight = height - margin.top - margin.bottom;

    //SCALES & AXES
    var x = d3.time.scale()
    .domain(d3.extent(points, p => p.year))
    .range([0, drawingWidth])
    var y = d3.scale.linear()
    .domain([0, d3.max(points, p => p.val)])
    .range([drawingHeight, 0])

    var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").outerTickSize(0).ticks(d3.time.years, 4)

    var yAxis = d3.svg.axis().scale(y)
    .orient("left").outerTickSize(0).ticks(6)

    // SVG
    var line = d3.svg.line()
    .x(d => x(d.year))
    .y(d => y(d.val))
    .interpolate("basis")

    var svg = d3.select(this.refs["le-svg"].getDOMNode())
    var playground = svg
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    playground.append("path")
    .datum(points)
    .attr("class", "line")
    .attr("d", line)

    playground.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    // making the horizontal ticks chart-wide
    .selectAll(".tick line")
    .attr("x1", 0)
    .attr("x2", drawingWidth)

    playground.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + drawingHeight + ")")
    .call(xAxis)
    .selectAll(".tick line")
    .attr("y1", 1)
    .attr("y2", 6)
  }


});

module.exports = Chart;
