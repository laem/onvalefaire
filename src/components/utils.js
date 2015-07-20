'use strict'

let d3 = require('d3')

let Utils = {}

//transforms an object from to an array of year time-series points
Utils.yearSeriesArray = function(o, marker){
  return Object.keys(o).map(k => {
    let point = {
      year: d3.time.format("%Y").parse(k),
      val: +o[k]
    }
    if (typeof marker === "string"){
      point.marker = marker
    }

    return point
    })
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
Utils.debounce = function(func, wait, immediate) {
	let timeout
	return function() {
		let context = this, args = arguments
		let later = function() {
			timeout = null
			if (!immediate) {
        func.apply(context, args)
      }
		}
		let callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) {
      func.apply(context, args)
    }
	}
}


module.exports = Utils
