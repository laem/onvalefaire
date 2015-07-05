'use strict';

describe('ChartC', function () {
  var React = require('react/addons');
  var ChartC, component;

  beforeEach(function () {
    ChartC = require('components/ChartC.js');
    component = React.createElement(ChartC);
  });

  it('should create a new instance of ChartC', function () {
    expect(component).toBeDefined();
  });
});
