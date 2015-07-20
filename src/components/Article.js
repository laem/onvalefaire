'use strict';

let React = require('react/addons');
let Chart = require('./Chart')
let InfoOverlay = require('./InfoOverlay')

// CSS
require('normalize.css');
require('../styles/main.sass');
let anSource = require("../images/an.png")

let req = require.context('json!yaml!../../db', true, /.doc.yaml$/);
//each document contains a quote and data
let documents = req.keys().map(key => {
  let doc = req(key)
  //"key is smthng like ./2015/loi-transition-energetique/1-ges.doc.yaml"
  doc.id = key.split("/").pop().split(".").shift()
  return doc
})

let OnvalefaireApp = React.createClass({
  getInitialState: function(){
      return {
        info: null
      }
  },

  render: function() {
    return (
      <div className='main'>
      <InfoOverlay
        about={this.state.info}
        close={this.closeOverlay}
        contribute={this.openOverlay.bind(this, "contribute")}/>
      <div className="article-header">
        <div className="title">
         <div className="decoration">
           <img src={anSource}/>
         </div>
         <h1>Loi sur la transition énergétique</h1>
         <span className="date">27 mai 2015</span>
         <span
          className="number-circle"
          onClick={this.openOverlay.bind(this, "info")}>
          i</span>
        </div>
      </div>
       <article style={{display: this.state.info === null ? "block" : "none"}}>
        <ul>
          {documents.map(document =>
            <li id={document.id}>
              <q cite="masource.com" dangerouslySetInnerHTML={{__html: document.quote.text}}>
              </q>
              <Chart data={document.data} icon={document.icon}/>
            </li>
          )}
        </ul>
        <div id="footer">
          <a href="#" onClick={this.openOverlay.bind(this, "info")}>À propos</a>
          <a href="#" onClick={this.openOverlay.bind(this, "contribute")}>Contact</a>
        </div>
  	   </article>

      </div>
    );
  },
  openOverlay: function(value){
    this.setState({
      info: value
    })
  },
  closeOverlay: function(){
    this.setState({
      info: null
    })
  }
});

module.exports = OnvalefaireApp;
