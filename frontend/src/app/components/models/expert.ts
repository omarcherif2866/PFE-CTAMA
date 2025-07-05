import { Clients } from "./clients";
import { Documents } from "./documents";


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
    Kébili = "Kébili",
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

export class Expert {
    private _id: string;
    private email: string;
    private password: string;
    private confirmPassword?: string;
    private image: string;
    private phoneNumber: string;
    private region: Gouvernorat | string;
    private taux: number;
    private nom: string;
    private prenom: string;
    private clients: Clients[];  // Liste des clients affectés
    private documents: Documents[]; // Liste des documents affectés
    private imageSinistre?: string[];
    constructor(
        _id: string,
        email: string,
        password: string,
        image: string,
        phoneNumber: string,
        region: string,
        taux: number,
        nom: string,
        prenom: string,
        clients: Clients[] = [],  // Initialisation par défaut
        documents: Documents[] = [], // Initialisation par défaut
        confirmPassword?: string,
        imageSinistre?: string[]

    ) {
        this._id = _id;
        this.email = email;
        this.password = password;
        this.image = image;
        this.phoneNumber = phoneNumber;
        this.nom = nom;
        this.prenom = prenom;
        this.taux = taux;
        this.region = region;
        this.clients = clients;
         this.documents = documents;
        this.confirmPassword = confirmPassword;
         this.imageSinistre = imageSinistre ?? undefined;

    }

    // Getters et Setters
    public get Id(): string {
        return this._id;
    }

    public get Email(): string {
        return this.email;
    }

    public set Email(email: string) {
        this.email = email;
    }

    public get PhoneNumber(): string {
        return this.phoneNumber;
    }

    public set PhoneNumber(phone: string) {
        this.phoneNumber = phone;
    }

    public get Nom(): string {
        return this.nom;
    }

    public set Nom(nom: string) {
        this.nom = nom;
    }

    public get Prenom(): string {
        return this.prenom;
    }

    public set Prenom(prenom: string) {
        this.prenom = prenom;
    }

    public get Image(): string {
        return this.image;
    }

    public set Image(image: string) {
        this.image = image;
    }

    public get Region(): string {
        return this.region;
    }

    public set Region(region: string) {
        this.region = region;
    }

    public get Taux(): number {
        return this.taux;
    }

    public set Taux(taux: number) {
        this.taux = taux;
    }

    public get Clients(): Clients[] {
        return this.clients;
    }

    public set Clients(clients: Clients[]) {
        this.clients = clients;
    }

    public get Documents(): Documents[] {
        return this.documents;
    }

    public set Documents(documents: Documents[]) {
        this.documents = documents;
    }

    public get ImageSinistre(): string[] | undefined {
        return this.imageSinistre;
      }

    public set ImageSinistre(value: string[] | undefined) {
        this.imageSinistre = value;
    }
}
