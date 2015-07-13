'use strict';

let React = require('react/addons');
let Chart = require('./Chart')

// CSS
require('normalize.css');
require('../styles/main.sass');
let anSource = require("../images/an.png")

let req = require.context('json!yaml!../../db', true, /.doc.yaml$/);
//each document contains a quote and data
let documents = req.keys().map(key => req(key))

let OnvalefaireApp = React.createClass({
  render: function() {
    return (
      <div className='main'>
      <div className="article-header">
        <div className="title">
         <div className="decoration">
           <img src={anSource}/>
         </div>
         <h2>Loi sur la transition énergétique</h2>
         <span className="date">27 mai 2015</span>
        </div>
      </div>
       <article>
        <ul>
          {documents.map(document =>
            <li>
              <q cite="masource.com" dangerouslySetInnerHTML={{__html: document.quote.text}}>
              </q>
              <Chart data={document.data} icon={document.icon}/>
            </li>
          )}
        </ul>
  	   </article>
      </div>
    );
  }
});

module.exports = OnvalefaireApp;
