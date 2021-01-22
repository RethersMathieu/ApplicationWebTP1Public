/** En JavaScript on ne peut pas déclarer directement de tableau à n dimensions
*   en précisant toutes les dimensions. tab [4][4] n'est pas possible par exemple.
*   On déclare en général un tableau à une dimension de taille varialbe (ci-dessous 
*   let arr = []) puis ensuite pour chacune des lignes du tableau, on lui affecte un autre
*   tableau (arr[i] = [] ci-dessous)
*/
function create2DArray(rows) {
  let arr = [];

  for (let i = 0; i < rows; i++) {
    arr[i] = [];
  }

  return arr;
}

/**
 * ajoute 10 points au score et met à jour l'affichage du score
 */
function addPoint() {
  score+=10;
  updateScore();
}

/**
 * met à jour l'affichage du score
 */
function updateScore() {
  let newScore = "Score : " + score;
  document.querySelector("#score").textContent = newScore;
}

/**
 * 
 */
function afficheAlignementPossible() {
  
}
