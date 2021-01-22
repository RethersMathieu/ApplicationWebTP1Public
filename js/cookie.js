class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  /**
   * constructeur
   * @param {*} type 
   * @param {*} ligne 
   * @param {*} colonne 
   */
  constructor(type, ligne, colonne) {
    //instanciation des propriétés
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;

    //creation image html
    this.htmlImage = document.createElement('img');
    this.htmlImage.src = Cookie.urlsImagesNormales[type];
    this.htmlImage.dataset.type = this.type;
    this.htmlImage.dataset.ligne = this.ligne;
    this.htmlImage.dataset.colonne = this.colonne;
    this.htmlImage.className = 'cookies';
  }

  /**
   * ajoute la class css 'cookies-selected'
   */
  selectionnee() {
    // on change l'image et la classe CSS
    this.htmlImage.classList.add("cookies-selected");
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
  }

  /**
   * supprime la class css 'cookies-selected'
   */
  deselectionnee() {
    // on change l'image et la classe CSS
    this.htmlImage.classList.remove("cookies-selected");
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
  }

  /**
   * Remplace le type est l'image source selon le type rentrée en paramètre
   * @param {*} newType 
   */
  remplacerParType(newType) {
    this.type = newType;
    this.htmlImage.src = Cookie.urlsImagesNormales[newType];
  }

  /**
   * remplace les images sur les 2 objet Cookies
   * @param {*} c1 
   * @param {*} c2 
   */
  static swapCookies(c1, c2) {
    if(c1!=null && c2!=null && Cookie.distance(c1, c2)==1)
    {
      //console.log("SWAP C1 C2");
      // On échange leurs images et types
      let tmpType = c1.type;
      let tmpImg = c1.htmlImage.src;

      c1.type = c2.type;
      c1.htmlImage.src = c2.htmlImage.src;

      c2.type = tmpType;
      c2.htmlImage.src = tmpImg;

      // et on remet les désélectionne
      c1.deselectionnee();
      c2.deselectionnee();
      return true;
    }
    return false;
  }

  /**
   * renvoie la distance entre deux cookies
   * @param {*} cookie1 
   * @param {*} cookie2 
   */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    console.log("Distance = " + distance);
    return distance;
  }
}
