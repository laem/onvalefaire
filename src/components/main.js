'use strict';

var OnvalefaireApp = require('./OnvalefaireApp');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var content = document.getElementById('content');

var Routes = (
  <Route handler={OnvalefaireApp}>
    <Route name="/" handler={OnvalefaireApp}/>
  </Route>
);

Router.run(Routes, function (Handler) {
  React.render(<Handler/>, content);
});
