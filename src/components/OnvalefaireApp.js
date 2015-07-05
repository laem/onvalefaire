'use strict';

var React = require('react/addons');
var Chart = require('./Chart')

// CSS
require('normalize.css');
require('../styles/main.sass');
var anSource = require("../images/an.png")

var req = require.context('json!yaml!../../db', true, /.doc.yaml$/);
//each document contains a quote and data
var documents = req.keys().map(key => req(key))

var OnvalefaireApp = React.createClass({
  render: function() {
    return (
      <div className='main'>
    	 <article>
       <div className="title">
        <div className="decoration">
          <img src={anSource}/><span className="date">27 mai 2015</span>
        </div>
        <h2>Loi sur la transition énergétique</h2>
       </div>
        <ul>
          {documents.map(document =>
            <li>
              <q cite="masource.com" dangerouslySetInnerHTML={{__html: document.quote.text}}>
              </q>
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
