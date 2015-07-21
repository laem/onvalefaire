'use strict';

let React = require('react/addons');
let d3 = require('d3')
let Utils = require('./utils.js')
let ChartInfo = require('./ChartInfo.js')

let Save = require('save-svg-as-png')

require('styles/Chart.sass');

let Chart = React.createClass({

  getInitialState: () => Object({
      infoDisplay: "none"
  }),

  render: function() {

    return (
        <div className="chart">
          <div ref="le-chart">
          </div>

          <ChartInfo
            source={this.props.data.source} display={this.state.infoDisplay}
            close={this.hideInfo}/>
        </div>
      );
  },

  showInfo: function(){
    this.setState({
      infoDisplay: "block"
    })
  },

  hideInfo: function(){
    this.setState({
      infoDisplay: "none"
    })
  },

  componentDidMount: function(){
    this.draw()
    let comp = this
    window.addEventListener("resize", Utils.debounce(function() {
      comp.draw()
    }, 150))

  },

  draw: function(){

    //DATA
    let {history, objectives, source} = this.props.data
    let icon = require("../images/quote-icons/" + this.props.icon)

    //compute objective if they are operations
    Object.keys(objectives).forEach(k => {
      if (typeof objectives[k] === "number") {return}
      let matches = objectives[k].match(/(\d+)\s?%\s?\[(\d{4})\]/) // e.g 20 % [1990] for 20 percent of the value in 1990
      if (matches && matches.length > 0 ){
        let [, percent, year] = matches
        objectives[k] = history[year] * (+percent) / 100
      }
    })

    //get a list of points from these objects
    let historyPoints = Utils.yearSeriesArray(history),
    lastHistoryPoint = historyPoints.reduce((mem, next) => next.year > mem.year ? next : mem),
    objectivePoints = [lastHistoryPoint, ...Utils.yearSeriesArray(objectives, "objective")],
    points = historyPoints.concat(objectivePoints);

    //DRAWING SIZES
    let [ww, _] = this.getWindowDimensions(),
    factor = ww < 600 ? 0.9 : ( ww < 900 ? 0.8 : (ww < 1390 ? 0.6 : 0.55)),
    [w, h] = [ww * factor, ww * factor * 0.375],
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    drawingWidth = w - margin.left - margin.right,
    drawingHeight = h - margin.top - margin.bottom;

    let leChart = this.refs["le-chart"].getDOMNode()
    leChart.innerHTML = ""
    let svg = d3.select(leChart).append("svg")
    let defs = svg.append("defs");
    let playground = svg
    .attr("width", w)
    .attr("height", h)
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

    let filter = defs.append("filter").attr("id", "teinte")
    filter.append("feColorMatrix")
    .attr("in", "SourceGraphic")
    .attr("type", "matrix")
    .attr("values",  `0 0 0 0 0.08
                      0 0 0 0 0.62
                      0 0 0 0 0.52
                      0 0 0 1 0`)

    playground.append("image")
    .attr(
      { "class": "icon",
        "xlink:xlink:href": icon.substring(1),
        "x": drawingWidth / 4 + "px",
        "y": 0,
        "height": drawingHeight + "px",
        "width": drawingWidth / 2 + "px",
        "filter": "url(#teinte)"
      })
    .attr("opacity", "0.15")

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
    .attr("class", p => objectivePoints.some(o => o.year.getTime() === p.getTime()) ? "objective" : "")

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

    [historyPoints,objectivePoints].map(drawPartialLine)

    // POINT CIRCLES
    playground.append("g").attr("class", "circles")
    .selectAll("circle")
    .data(objectivePoints)
    .enter()
    .append("circle")
    .attr("r", 3.5)
    .attr("cx", p => x(p.year))
    .attr("cy", p => y(p.val))

    //FOCUS CIRCLE
    //http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html

    let focus = playground.append("g")
    .style("display", "none");
    focus.append("circle")
        .attr("class", "focus")
        .attr("r", 3.5);

    let focusValue = playground.append("text").attr("class", "focus-value")
    .attr("x", drawingWidth / 2)
    .attr("y", drawingHeight - 10)

    playground.append("rect").attr("class", "mouse-capture") //serves to capture the mouse
        .attr("width", drawingWidth)
        .attr("height", drawingHeight)
        .on("mouseover", function() { focus.style("display", null); focusValue.text("")})
        .on("mouseout", function() { focus.style("display", "none"); focusValue.text("")})
        .on("mousemove", function() {
            let d = x.invert(d3.mouse(this)[0]),
            year = d.getMonth() > 5 ? d.getFullYear() + 1 : d.getFullYear(),
            allYears = [].concat(...[history, objectives].map(Object.keys)), //yay flatmap
            closestYear = allYears.reduce((memo, y) => Math.abs(year - y) < Math.abs(memo - year) ? y : memo),
            val = history[closestYear + ""] || objectives[closestYear + ""]

            focus.select("circle.focus")
            .attr("transform",
                  "translate(" + x(d3.time.format("%Y").parse(closestYear + "")) + "," +
                                 y(val) + ")")

            let focusValueText =
            Math.abs(year - closestYear) < 3 ?
              `${Math.round(val * 10) / 10} ${source["unit-tip"] || ""} en ${year}`
              : ""
            focusValue.text(focusValueText)
        });

    //SOURCE BUTTON
    playground.append("text").attr("class", "info-button")
    .text("source")
    .attr("x", drawingWidth - 45)
    .attr("y", drawingHeight - 5)
    .on("click", this.showInfo)

    //Save.saveSvgAsPng(document.querySelector(".chart svg"), "diagram.png");


  },

  getWindowDimensions: function(){
      var d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0];

      var x = window.innerWidth || e.clientWidth || g.clientWidth;
      var y = window.innerHeight|| e.clientHeight|| g.clientHeight;

      return [x, y]
    },


})

module.exports = Chart;
