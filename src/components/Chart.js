'use strict';

let React = require('react/addons');
let d3 = require('d3')
let Utils = require('./utils.js')

require('styles/Chart.sass');

let Chart = React.createClass({

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
    let {history, objectives} = this.props.data
    //compute objective if they are operations
    Object.keys(objectives).forEach(k => {
      let matches = objectives[k].match(/(\d+)\s?%\s?\[(\d{4})\]/) // e.g 20 % [1990] for 20 percent of the value in 1990
      if (matches.length > 0 ){
        let [, percent, year] = matches
        objectives[k] = history[year] * (+percent) / 100
      }
    })
    //get a list of points from these objects
    let historyPoints = Utils.yearSeriesArray(history),
    lastHistoryPoint = historyPoints.reduce((mem, next) => next.year > mem.year ? next : mem),
    objectivePoints = [lastHistoryPoint, ...Utils.yearSeriesArray(objectives, "objective")],
    points = historyPoints.concat(objectivePoints);

    //SIZES
    let [width, height] = [800, 300]
    let margin = {top: 20, right: 20, bottom: 30, left: 50},
    drawingWidth = width - margin.left - margin.right,
    drawingHeight = height - margin.top - margin.bottom;

    let svg = d3.select(this.refs["le-svg"].getDOMNode())
    let playground = svg
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //SCALES & AXES
    let x = d3.time.scale()
    .range([0, drawingWidth])
    .domain(d3.extent(points, p => p.year))

    let y = d3.scale.linear()
    .range([drawingHeight, 0])
    .domain([0, d3.max(points, p => p.val)])

    let xAxis = d3.svg.axis().scale(x)
    .orient("bottom").outerTickSize(0).ticks(d3.time.years, 10)

    let yAxis = d3.svg.axis().scale(y)
    .orient("left").outerTickSize(0).ticks(6)

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

    d3.selectAll(".x.axis .tick text")
    .attr("class", p => objectivePoints.find(o => o.year.getTime() === p.getTime()) ? "objective" : "")

    // Draw the LINE(s)
    let line = d3.svg.line()
    .x(p => x(p.year))
    .y(p => y(p.val))
    .interpolate("basis")

    function drawPartialLine(points){
      playground.append("path")
      .datum(points)
      .attr("class", `line ${points.slice(-1)[0].marker || ""}`)
      .attr("d", line)
    }

    drawPartialLine(historyPoints)
    drawPartialLine(objectivePoints)

    // POINT CIRCLES
    playground.append("g").attr("class", "circles")
    .selectAll("circle")
    .data(objectivePoints)
    .enter()
    .append("circle")
    .attr("r", 3.5)
    .attr("cx", p => x(p.year))
    .attr("cy", p => y(p.val))

  }


});

module.exports = Chart;
