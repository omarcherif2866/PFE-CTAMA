import { Documents } from "./documents";

enum StatusSinistre {
    DECLARATION = 'déclaration',
    EXPERTISE = 'expertise',
    REGLEMENT = 'reglement'
}

export class Sinistre {
    private _id: string;
    private date_survenance: string;
    private date_declaration: string;
    private num_police: string;
    private objet_assure: string;
    private description: string;
    private _status: StatusSinistre;  // Utilisation de l'enum pour le statut
    private reference: string;
    private documents: Documents | null; // Un seul document

    constructor(
        _id: string,
        date_survenance: string,
        date_declaration: string,
        num_police: string,
        objet_assure: string,
        description: string,
        status: StatusSinistre,  // Paramètre pour le statut
        reference: string,
        documents: Documents | null = null // Initialisation à null

    ) {
        this._id = _id;
        this.date_survenance = date_survenance;
        this.date_declaration = date_declaration;
        this.num_police = num_police;
        this.objet_assure = objet_assure;
        this.description = description;
        this._status = status;
        this.reference = reference;
        this.documents = documents;

    }

    // Getters
    public get Id(): string {
        return this._id;
    }

    public get DateSurvenance(): string {
        return this.date_survenance;
    }

    public get DateDeclaration(): string {
        return this.date_declaration;
    }

    public get NumeroPolice(): string {
        return this.num_police;
    }

    public get ObjetAssure(): string {
        return this.objet_assure;
    }

    public get Description(): string {
        return this.description;
    }

    public get Status(): StatusSinistre {
        return this._status;
    }

    public get Reference(): string {
        return this.reference;
    }

    // Setters
    public set Id(value: string) {
        this._id = value;
    }

    public set DateSurvenance(value: string) {
        this.date_survenance = value;
    }

    public set DateDeclaration(value: string) {
        this.date_declaration = value;
    }

    public set NumeroPolice(value: string) {
        this.num_police = value;
    }

    public set ObjetAssure(value: string) {
        this.objet_assure = value;
    }

    public set Description(value: string) {
        this.description = value;
    }

    public set Status(value: StatusSinistre) {
        this._status = value;
    }

    public set Reference(value: string) {
        this.reference = value;
    }

    public get Documents(): Documents | null {
        return this.documents;
    }

    public set Documents(document: Documents | null) {
        this.documents = document;
    }
}
