'use strict';

let React = require('react/addons');
require('styles/ChartInfo.sass');

module.exports = React.createClass({

  render: function(){
    let source = this.props.source
    return (
      <div className="info" style={{display: this.props.display}}>
        <div className="title">
          <span>{source.description}</span>
          <a target="_blank" href={source.link}>{source.link}</a>
        </div>
        <div><span className="descriptor">Source:</span> {source.title}</div>
        <div><span className="descriptor">Unité:</span> {source.unit}</div>
        {typeof source.reference !== "undefined" ?
          <div><span className="descriptor">Ref. série:</span> {source.reference}</div>
          : <div/>
        }
        <div className="back-button" onClick={this.props.close}>Revenir</div>
      </div>
      )

  }
})
