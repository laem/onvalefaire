'use strict';

var React = require('react/addons');
var Chart = require('./Chart')

// CSS
require('normalize.css');
require('../styles/main.sass');

var req = require.context('json!yaml!../../db', true, /.yaml$/);
//each document contains a quote and data
var documents = req.keys().map(key => req(key))

var OnvalefaireApp = React.createClass({
  render: function() {
    return (
      <div className='main'>
    	 <article>
        <h2>Loi sur la transition énergétique</h2>
        <ul>
          {documents.map(document =>
            <li>
              <q cite="masource.com">{document.quote.text}</q>
              <Chart data={document.data} />
            </li>
          )}
        </ul>
  	   </article>
      </div>
    );
  }
});

module.exports = OnvalefaireApp;
