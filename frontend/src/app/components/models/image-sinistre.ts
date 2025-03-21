import { Clients } from "./clients";
import { Documents } from "./documents";
import { Expert } from "./expert";

export class ImageSinistre {
  private _id?: string;
  private image: string[] = []; 
  private imageAfterAccident: string[] = []; 
  private dateAjout: Date;
  private expert: Expert;
  private client: Clients;
  private documents: Documents;

  constructor(
    image: string[],
    imageAfterAccident: string[], // Correction : Accepter un tableau d'images
    expert: Expert,
    client: Clients,
    dateAjout: string | Date,
    documents: Documents,
    id?: string
  ) {
    this._id = id; // Affecter l'ID ici
    this.image = image;
    this.imageAfterAccident = imageAfterAccident;
    this.expert = expert;
    this.client = client;
    this.dateAjout = new Date(dateAjout);
    this.documents = documents;

  }

  // Getters et Setters
  public get Id(): string | undefined {
    return this._id;
  }

  public get Image(): string[] { // Correction : Retourner un tableau
    return this.image;
  }

  public set Image(value: string[]) { // Correction : Accepter un tableau
    this.image = value;
  }

  public get ImageAfterAccident(): string[] { // Correction : Retourner un tableau
    return this.imageAfterAccident;
  }

  public set ImageAfterAccident(value: string[]) { // Correction : Accepter un tableau
    this.imageAfterAccident = value;
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
