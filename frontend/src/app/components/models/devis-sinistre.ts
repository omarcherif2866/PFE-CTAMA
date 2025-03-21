import { Clients } from "./clients";
import { Documents } from "./documents";
import { Expert } from "./expert";

export class DevisSinistre {
  private _id?: string;
  private devis: string[]; // Correction : Liste d'deviss
  private dateAjout: Date;
  private expert: Expert;
  private client: Clients;
  private documents: Documents;

  constructor(
    devis: string[], // Correction : Accepter un tableau d'deviss
    expert: Expert,
    client: Clients,
    dateAjout: string | Date,
    documents: Documents,
    id?: string
  ) {
    this._id = id;
    this.devis = devis;
    this.expert = expert;
    this.client = client;
    this.documents = documents;
    this.dateAjout = new Date(dateAjout);
  }

  // Getters et Setters
  public get Id(): string | undefined {
    return this._id;
  }

  public get Devis(): string[] { // Correction : Retourner un tableau
    return this.devis;
  }

  public set Devis(value: string[]) { // Correction : Accepter un tableau
    this.devis = value;
  }

  public get DateAjout(): Date {
    return this.dateAjout;
  }

  public set DateAjout(value: string | Date) {
    this.dateAjout = new Date(value);
  }

  public get Expert(): Expert {
    return this.expert;
  }

  public set Expert(value: Expert) {
    this.expert = value;
  }

  public get Client(): Clients {
    return this.client;
  }

  public set Client(value: Clients) {
    this.client = value;
  }

  public get Documents(): Documents {
    return this.documents;
  }

  public set Documents(value: Documents) {
    this.documents = value;
  }
}
