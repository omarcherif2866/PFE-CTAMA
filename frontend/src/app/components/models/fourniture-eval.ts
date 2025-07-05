import { Fournitures } from "./fournitures";

export class FournitureEval {
    private _id: string;
    private fourniture: Fournitures;
    private prix: number;


    constructor(
        _id: string,
        fourniture: Fournitures,
        prix: number,

    ) {
        this._id = _id;
        this.fourniture = fourniture;
        this.prix = prix;

    }

    // Getters
    public  get Id(): string {  // Méthode getter pour _id
        return this._id;
    }

    public  get Fourniture(): Fournitures {
        return this.fourniture;
    }

    public get Prix(): number {
      return this.prix;
    }
    public set Prix(prix: number) {
      this.prix = prix;
    }
    // Setters
    public  set Fourniture(value: Fournitures) {
        this.fourniture = value;
    }


}
