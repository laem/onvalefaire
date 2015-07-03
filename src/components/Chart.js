'use strict';

var React = require('react/addons');
var d3 = require('d3')

require('styles/Chart.sass');

var Chart = React.createClass({

  render: function () {
    return (
        <div className="chart">
          <div id="le-chart">
            <img src="../images/sparkline.png" width="300px"/>
          </div>
        </div>
      );
  },


});

module.exports = Chart;
