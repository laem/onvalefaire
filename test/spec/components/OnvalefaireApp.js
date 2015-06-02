'use strict';

describe('OnvalefaireApp', function () {
  var React = require('react/addons');
  var OnvalefaireApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    OnvalefaireApp = require('components/OnvalefaireApp.js');
    component = React.createElement(OnvalefaireApp);
  });

  it('should create a new instance of OnvalefaireApp', function () {
    expect(component).toBeDefined();
  });
});
