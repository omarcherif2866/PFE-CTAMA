export class Voiture {
    private _id: string;
    private puissance_fiscale: number;
    private marque: string;
    private modele: string;
    private nbr_portes: number;
    private num_chas: string;

    constructor(
        _id: string,
        puissance_fiscale: number,
        marque: string,
        modele: string,
        nbr_portes: number,
        num_chas: string,
    ) {
        this._id = _id;
        this.puissance_fiscale = puissance_fiscale;
        this.marque = marque;
        this.modele = modele;
        this.nbr_portes = nbr_portes;
        this.num_chas = num_chas;
    }

    // Getters
    public  get Id(): string {  // Méthode getter pour _id
        return this._id;
    }

    public  get PuissanceFiscale(): number {
        return this.puissance_fiscale;
    }

    public  get Marque(): string {
        return this.marque;
    }

    public  get Modele(): string {
        return this.modele;
    }

    public  get NbrPortes(): number {
        return this.nbr_portes;
    }

    public  get NumChas(): string {
        return this.num_chas;
    }

    // Setters
    public  set PuissanceFiscale(value: number) {
        this.puissance_fiscale = value;
    }

    public  set Marque(value: string) {
        this.marque = value;
    }

    public  set Modele(value: string) {
        this.modele = value;
    }

    public  set NbrPortes(value: number) {
        this.nbr_portes = value;
    }

    public  set NumChas(value: string) {
        this.num_chas = value;
    }

    public set Id(value: string) {
        this._id = value;
      }
}
