export class Fournitures {
    private _id: string;
    private nom: string;
    private type: 'Pieces' | 'MainsDoeuvre';


    constructor(
        _id: string,
        nom: string,
        type: 'Pieces' | 'MainsDoeuvre',

    ) {
        this._id = _id;
        this.nom = nom;
        this.type = type;

    }

    // Getters
    public  get Id(): string {  // Méthode getter pour _id
        return this._id;
    }

    public  get Nom(): string {
        return this.nom;
    }

    public get Type(): string {
      return this.type;
    }
    public set Type(type: 'Pieces' | 'MainsDoeuvre') {
      this.type = type;
    }
    // Setters
    public  set Nom(value: string) {
        this.nom = value;
    }


}
