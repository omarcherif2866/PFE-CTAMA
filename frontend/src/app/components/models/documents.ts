import { Gouvernorat } from "./agence";
import { Clients } from "./clients";
import { Expert } from "./expert";

export class Documents {
    private _id: string;
    private doc: string;
    private expert?: Expert;  // 👈 Expert optionnel (par défaut vide)
    private client?: Clients;
    private description: string;
    private status: 'En attente' | 'Validé' | 'Non Validé';  // 👈 Définir le type comme un enum
    private gouvernorat: Gouvernorat | string; // Permettre string en plus de Gouvernorat

    constructor(
      _id: string,
      doc: string,
      description: string,
      status: 'En attente' | 'Validé' | 'Non Validé' = 'En attente',  // 👈 Définir une valeur par défaut pour status
      client?: Clients,
      expert?: Expert,
      gouvernorat: Gouvernorat | string = '' // Valeur vide autorisée
    ) {
      this._id = _id;
      this.doc = doc;
      this.expert = expert ?? undefined;
      this.client = client ?? undefined;
      this.description = description;
      this.status = status;  // 👈 Initialisation du status
      this.gouvernorat = gouvernorat;
    }
  
    // Getters
    public get Id(): string {
      return this._id;
    }
  
    public get Doc(): string {
      return this.doc;
    }
  
    public get Description(): string {
      return this.description;
    }
  
    public get Client(): Clients | undefined {
      return this.client;
    }

    public get Expert(): Expert | undefined {
      return this.expert;
    }

    public get Status(): 'En attente' | 'Validé' | 'Non Validé' {  // 👈 Définir le type de retour comme un enum
        return this.status;
    }

      public get Gouvernorat(): Gouvernorat | string {
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


  
    public set Doc(value: string) {
      this.doc = value;
    }
  
    public set Description(value: string) {
      this.description = value;
    }
  
    public set Client(value: Clients | undefined) {
      this.client = value;
    }  

    public set Expert(value: Expert | undefined) {
      this.expert = value;
    }

    public set Status(value: 'En attente' | 'Validé' | 'Non Validé') {  // 👈 Définir le type de paramètre comme un enum
        this.status = value;
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
