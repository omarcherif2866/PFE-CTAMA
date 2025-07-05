export enum Gouvernorat {
    Ariana = "Ariana",
    Béja = "Béja",
    BenArous = "Ben Arous",
    Bizerte = "Bizerte",
    Gabès = "Gabès",
    Gafsa = "Gafsa",
    Jendouba = "Jendouba",
    Kairouan = "Kairouan",
    Kasserine = "Kasserine",
    Kébili = "Kebili",
    LeKef = "Kef",
    Mahdia = "Mahdia",
    LaManouba = "Manouba",
    Médenine = "Médenine",
    Monastir = "Monastir",
    Nabeul = "Nabeul",
    Sfax = "Sfax",
    SidiBouzid = "Sidi Bouzid",
    Siliana = "Siliana",
    Sousse = "Sousse",
    Tataouine = "Tataouine",
    Tozeur = "Tozeur",
    Tunis = "Tunis",
    Zaghouan = "Zaghouan"
}

export class Agence {
    private _id: string;
    private nom: string;
    private chefAgence: string;
    private email: string;
    private numero: string;
    private adresse: string;
    private gouvernorat: Gouvernorat | string; // Permettre string en plus de Gouvernorat

    constructor(
        _id: string = '',
        nom: string = '',
        chefAgence: string = '',
        email: string = '',
        numero: string = '',
        adresse: string = '',
        gouvernorat: Gouvernorat | string = '' // Valeur vide autorisée
    ) {
        this._id = _id;
        this.nom = nom;
        this.chefAgence = chefAgence;
        this.email = email;
        this.numero = numero;
        this.adresse = adresse;
        this.gouvernorat = gouvernorat;
    }

    // Getters
    public get Id(): string {
        return this._id;
    }

    public get Nom(): string {
        return this.nom;
    }

    public get ChefAgence(): string {
        return this.chefAgence;
    }

    public get Email(): string {
        return this.email;
    }

    public get Numero(): string {
        return this.numero;
    }

    public get Adresse(): string {
        return this.adresse;
    }

    public get Gouvernorat(): Gouvernorat | string {
        console.log('Accès à Gouvernorat:', this.gouvernorat); // Ajout d'un log pour vérifier la valeur
        if (Object.values(Gouvernorat).includes(this.gouvernorat as Gouvernorat)) {
          return this.gouvernorat as Gouvernorat;
        } else {
          return this.gouvernorat;  // retourne le string si ce n'est pas une valeur de l'énumération
        }
      }
      
    
    

    // Setters
    public set Id(value: string) {
        this._id = value;
    }

    public set Nom(value: string) {
        this.nom = value;
    }

    public set ChefAgence(value: string) {
        this.chefAgence = value;
    }

    public set Email(value: string) {
        this.email = value;
    }

    public set Numero(value: string) {
        this.numero = value;
    }

    public set Adresse(value: string) {
        this.adresse = value;
    }

    public set Gouvernorat(value: Gouvernorat | string) {
        if (typeof value === 'string' && Object.values(Gouvernorat).includes(value as Gouvernorat)) {
            this.gouvernorat = value as Gouvernorat;
        } else if (typeof value === 'string') {
            console.warn(`Valeur inconnue pour Gouvernorat: ${value}`);
            this.gouvernorat = value; // Conserve la valeur texte si elle ne correspond pas à l'énumération
        }
    }
    
    
}
