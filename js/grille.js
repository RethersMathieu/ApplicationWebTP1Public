/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {

  //array récupérant les cookies sélectionné par le clique du joueur
  cookieClicked = [];

  //attribut enregistrant le cookie drag
  cookieDrag;
  //attribut enregistrant le cookie qui obtiendra le cookie drop
  cookieDrop;

  /**
   * constructeur
   * @param {*} l 
   * @param {*} c 
   */
  constructor(l, c) {
    this.l = l;
    this.c = c;

    this.tabCookie = create2DArray(this.l);
    this.remplirTableauDeCookies(Cookie.urlsImagesNormales.length);
    
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index/this.l);
      let colonne = index%this.c;
      
      let img = this.tabCookie[ligne][colonne].htmlImage;

      img.setAttribute("draggable",true);

      img.onclick = (event) => {

        let cookieSelect = this.getCookie(event.target.dataset.ligne, event.target.dataset.colonne);

        if(this.cookieClicked.length == 0) {
          this.cookieClicked.push(cookieSelect);
          cookieSelect.selectionnee();
        }
        else if(this.cookieClicked.length == 1) {
          if(!this.cookieClicked.includes(cookieSelect)) {
            this.cookieClicked.push(cookieSelect);
            cookieSelect.selectionnee();

            if(Cookie.distance(this.cookieClicked[0], this.cookieClicked[1]) == 1) {
              Cookie.swapCookies(this.cookieClicked[0], this.cookieClicked[1]);
              this.cookieClicked = [];
            } 
            else {
              this.cookieClicked[0].deselectionnee();
              this.cookieClicked[1].deselectionnee();

              this.cookieClicked = [];
            }
          }
        }
      }

      img.ondragstart = (event) => {
        this.cookieDrag = this.getCookie(event.target.dataset.ligne, event.target.dataset.colonne);
      }

      img.ondragenter = (event) => {
        let cookieDrop = this.getCookie(event.target.dataset.ligne, event.target.dataset.colonne);

        if(Cookie.distance(this.cookieDrag, cookieDrop) == 1) {
          event.target.classList.add("grilleDragOver");
          cookieDrop.selectionnee(); 
        }
      }

      img.ondragleave = (event) => {
        let cookieDrop = this.getCookie(event.target.dataset.ligne, event.target.dataset.colonne);

        event.target.classList.remove("grilleDragOver");
        cookieDrop.deselectionnee();

      }

      img.ondragover = (event) => {
        event.preventDefault();
      }

      img.ondrop = (event) => {
        this.cookieDrop = this.getCookie(event.target.dataset.ligne, event.target.dataset.colonne);
        Cookie.swapCookies(this.cookieDrag, this.cookieDrop)
        this.clearDragDrop();
        this.deleteCumuls();
        console.log("Score : " + score);
      }

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);
    });
  }

  
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   * @param {*} nbDeCookiesDifferents
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {

    for(let ligne=0; ligne<this.l; ligne++) {

      for(let colonne=0; colonne<this.c; colonne++) {

        let tabCookieDontGenerate = [];
        
        if(ligne > 1 ) {
          let cookiePre0 = this.tabCookie[ligne-1][colonne];
          let cookiePre1 = this.tabCookie[ligne-2][colonne];
          if(cookiePre0.type === cookiePre1.type && !tabCookieDontGenerate.includes(cookiePre0)) {
            tabCookieDontGenerate.push(cookiePre0.type);
          }
        }

        if(colonne > 1) {
          let cookiePre0 = this.tabCookie[ligne][colonne-1];
          let cookiePre1 = this.tabCookie[ligne][colonne-2];
          if(cookiePre0.type === cookiePre1.type && !tabCookieDontGenerate.includes(cookiePre0)) {
            tabCookieDontGenerate.push(cookiePre0.type);
          }
        }

        let type;
        do {
          type = Math.floor(nbDeCookiesDifferents * Math.random());
        }while(tabCookieDontGenerate.includes(type));
        
        this.tabCookie[ligne].push(new Cookie(type, ligne, colonne));
      }
    }
  }

  /**
   * permet d'obtenir un cookie selon la position (ligne & colonne)
   * @param {*} ligne 
   * @param {*} colonne 
   */
  getCookie(ligne, colonne) {
    return this.tabCookie[ligne][colonne];
  }

  /**
   * clear 'cookieDrag' & 'cookieDrop'
   */
  clearDragDrop() {

    console.log("drag & drop clear");

    this.cookieDrag.htmlImage.classList.remove("grilleDragOver");
    this.cookieDrop.htmlImage.classList.remove("grilleDragOver");

    this.cookieDrag = null;
    this.cookieDrop = null;
    
  }

  /**
   * supprime les alignements des lignes
   */
  deleteCumuls() {

    //Array qui récupére les cookies à remplacer
    let cookiesToDelete = [];

    //ajoute tout les cookies etant dans un cumul de cookie
    this.detecteCumul().forEach( (cumul) => {
      cumul.forEach( (cookie) => {
        if(!cookiesToDelete.includes(cookie)) {
          cookiesToDelete.push(cookie);
        }
      });
    });


    //verifi si 'cookiesToDelete' ne soit pas vide
    if(cookiesToDelete.length != 0) {

      //Boucle pour lire les lignes de la grille (en descente)
      for(let i = 0; i < this.l; i++) {
        //Boucle pour lire les colonnes de la grille (vers la droite)
        for(let j = 0; j < this.c; j++) {
          
          if(cookiesToDelete.includes(this.tabCookie[i][j])) {

            //Ajout des points
            addPoint();

            if(i == 0) {
              let newType = Math.floor(Cookie.urlsImagesNormales.length * Math.random());
  
              this.tabCookie[i][j].type = newType;
              this.tabCookie[i][j].htmlImage.src = Cookie.urlsImagesNormales[newType];
            }
            else {

              //Boucle pour lire les lignes de la grille (en montante)
              for(let g = i; g >= 0; g--) {

                if(g == 0) {

                  let newType = Math.floor(Cookie.urlsImagesNormales.length * Math.random());
                  this.tabCookie[g][j].type = newType;
                  this.tabCookie[g][j].htmlImage.src = Cookie.urlsImagesNormales[newType];

                }
                else {

                  let cookiePrecedent = this.tabCookie[g-1][j];
                  this.tabCookie[g][j].type = cookiePrecedent.type;
                  this.tabCookie[g][j].htmlImage.src = cookiePrecedent.htmlImage.src;
                  
                }
              }
            }
          }
        }
      }
      this.deleteCumuls();
    }
  }

  /**
   * détecte les alignements des cookies (ligne et colonne)
   */
  detecteCumul()
  {
    let tabCumul = [];

    for(let numLigne = 0; numLigne < this.l; numLigne++) {
      this.detecteCumulLigne(numLigne).forEach( (cumulLigne) => {
        tabCumul.push(cumulLigne);
      });
    }

    for(let numColonne = 0; numColonne < this.l; numColonne++) {
      this.detecteCumulColonne(numColonne).forEach( (cumulColonne) => {
        tabCumul.push(cumulColonne);
      });
    }

    return tabCumul;
  }

  /**
   * détecte les alignements des cookies (ligne)
   * @param {*} numLigne 
   */
  detecteCumulLigne(numLigne) {
    let ligne = this.tabCookie[numLigne];

    let tabCumul = [];

    for(let numColonne = 0; numColonne < ligne.length-1; numColonne++) {
      let cumul = [];

      while(numColonne < ligne.length-1 && ligne[numColonne].type === ligne[numColonne+1].type) {
        if(cumul.length == 0) {
          cumul.push(ligne[numColonne]);
        }
        cumul.push(ligne[numColonne+1]);
        numColonne++;
      }

      if(cumul.length > 2) {
        tabCumul.push(cumul);
      }
    }
    return tabCumul;
  }

  /**
   * détecte les alignements des cookies (colonne)
   * @param {*} numColonne 
   */
  detecteCumulColonne(numColonne) {
    let colonne = [];

    this.tabCookie.forEach( (ligne) => {
      colonne.push(ligne[numColonne]);
    });

    let tabCumul = [];

    for(let numLigne = 0; numLigne < colonne.length-1; numLigne++) {
      let cumul = [];

      while(numLigne < colonne.length-1 && colonne[numLigne].type === colonne[numLigne+1].type) {
        if(cumul.length == 0) {
          cumul.push(colonne[numLigne]);
        }
        cumul.push(colonne[numLigne+1]);
        numLigne++;
      }

      if(cumul.length > 2) {
        tabCumul.push(cumul);
      }
    }
    return tabCumul;
  }
}
