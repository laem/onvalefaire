'use strict';

let React = require('react/addons');
require('styles/InfoOverlay.sass');

module.exports = React.createClass({

  render: function(){
    let about = this.props.about,
    display = about === null ? "none" : "block";

    return (
      <div id="info-overlay" style={{display}}>
        <div className="content">
          {this.getContent()[about]}
        </div>
        <div className="back-button" onClick={this.props.close}>Revenir</div>

      </div>
      )

  },

  getContent: function(){
    return {
      "info": (
        <div>
          <h2>A propos</h2>
          <p>Après son adoption par l’<a  href="http://www.assemblee-nationale.fr/14/dossiers/transition_energetique_croissance_verte.asp"
              target="_blank">
          assemblée nationale</a> en nouvelle lecture le 26 mai 2015, le projet français de loi relatif à la transition énergétique pour la croissance verte doit être réexaminé par le <a  href="http://www.senat.fr/dossier-legislatif/pjl14-016.html"
              target="_blank">
          Sénat</a> du 9 au 17 juillet.</p>


          <p className="quote">Ce site présente les principaux objectifs chiffrés de cette loi, visualisés.
          Les sources sont ouvertes, notamment les <a href="https://github.com/laem/onvalefaire/tree/master/db/2015/loi-transition-energetique">données</a>.</p>
          <p>En le parcourant, <em><a href="#" onClick={this.props.contribute}>n'hésitez pas</a> à corriger, suggérer ou ajouter des observations</em></p>
        </div>
      ),

      "contribute": (
        <div>
          <h2>Contribuez !</h2>
          <p>
            Si vous êtes familiers avec la notion de <em>pull request</em> ou d'<em>issue</em> github, contribuez directement au <a href="https://github.com/laem/onvalefaire" target="_blank">projet</a>.
          </p>
          <p>
            Sinon, envoyez simplement un mail à <span className="dark">l4em -arobase- outlook.com.</span>
          </p>
        </div>
      )
    }
  }
})
