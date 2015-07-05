'use strict';

var d3 = require('d3')

var Utils = {}

//transforms an object from to an array of year time-series points
Utils.yearSeriesArray = function(o, marker){
  return Object.keys(o).map(k => {
    var point = {
      year: d3.time.format("%Y").parse(k),
      val: +o[k]
    }
    if (typeof marker === "string"){
      point.marker = marker
    }

    return point
    })
}


module.exports = Utils
