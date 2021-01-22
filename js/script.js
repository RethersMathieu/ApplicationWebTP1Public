// 1 On définisse une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES est chargée

window.onload = init;

//grille de la partie en cours
let grille;

//score
var score = 0;

function init() {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le DOM est ready (en fait un peu plus...)

  grille = new Grille(9, 9);
  grille.showCookies();

  let gridBonus = document.querySelector("#gridBonus");

  gridBonus.style.setProperty('grid-template-columns', "repeat("+ gridBonus.childElementCount +", " + gridBonus.offsetWidth/gridBonus.childElementCount +"px)");

}
