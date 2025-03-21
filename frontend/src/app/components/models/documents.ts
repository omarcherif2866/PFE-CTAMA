import { Clients } from "./clients";
import { Expert } from "./expert";

export class Documents {
    private _id: string;
    private doc: string;
    private expert?: Expert;  // 👈 Expert optionnel (par défaut vide)
    private client?: Clients;
    private description: string;
    private status: 'En attente' | 'Validé' | 'Non Validé';  // 👈 Définir le type comme un enum

    constructor(
      _id: string,
      doc: string,
      description: string,
      status: 'En attente' | 'Validé' | 'Non Validé' = 'En attente',  // 👈 Définir une valeur par défaut pour status
      client?: Clients,
      expert?: Expert
    ) {
      this._id = _id;
      this.doc = doc;
      this.expert = expert ?? undefined;
      this.client = client ?? undefined;
      this.description = description;
      this.status = status;  // 👈 Initialisation du status
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
}
