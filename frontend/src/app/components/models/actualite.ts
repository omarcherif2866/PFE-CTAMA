export class Actualite {
    private _id: string;
    private nom: string;
    private description: string;
    private image: string;
  
    constructor(
      _id: string,
      nom: string,
      description: string,
      image: string
    ) {
      this._id = _id;
      this.nom = nom;
      this.description = description;
      this.image = image;
    }
  
    // Getters
    public get Id(): string {
      return this._id;
    }
  
    public get Nom(): string {
      return this.nom;
    }
  
    public get Description(): string {
      return this.description;
    }
  
    public get Image(): string {
      return this.image;
    }
  
    // Setters
    public set Id(value: string) {
      this._id = value;
    }
  
    public set Nom(value: string) {
      this.nom = value;
    }
  
    public set Description(value: string) {
      this.description = value;
    }
  
    public set Image(value: string) {
      this.image = value;
    }
  }