'use strict';

var Article = require('./Article');
var React = require('react');

var content = document.getElementById('content');

  React.render(<Article/>, content);
