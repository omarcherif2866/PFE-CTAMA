import { Clients } from "./clients";
import { Expert } from "./expert";

export class RDV {
    private _id: string;
    private description: string;
    private date: string;
    private heure: string;
    private ownedBy: Expert;
    private receiver: Clients;

    constructor(
        _id: string,
        description: string,
        date: string,
        heure: string,
        ownedBy: Expert,
        receiver: Clients,
    ) {
        this._id = _id;
        this.description = description;
        this.date = date;
        this.heure = heure;
        this.ownedBy = ownedBy;
        this.receiver = receiver;
    }

    // Getters
    public  get Id(): string {  // Méthode getter pour _id
        return this._id;
    }


    public  get Description(): string {
        return this.description;
    }

    public  get Date(): string {
        return this.date;
    }

    public  get Heure(): string {
        return this.heure;
    }

    public  get OwnedBy(): Expert {
        return this.ownedBy;
    }

    public  get Receiver(): Clients {
        return this.receiver;
    }


    public  set Description(value: string) {
        this.description = value;
    }

    public  set Date(value: string) {
        this.date = value;
    }

    public  set Heure(value: string) {
        this.heure = value;
    }

    public  set OwnedBy(value: Expert) {
        this.ownedBy = value;
    }

    public  set Receiver(value: Clients) {
        this.receiver = value;
    }

    public set Id(value: string) {
        this._id = value;
      }

      static fromJSON(data: any): RDV {
        return new RDV(
            data._id,
            data.description,
            data.date,
            data.heure,
            new Expert(
                data.ownedBy?._id ?? '',
                data.ownedBy?.email ?? '',
                data.ownedBy?.password ?? '',
                data.ownedBy?.image ?? '',
                data.ownedBy?.phoneNumber ?? '',
                data.ownedBy?.region ?? '',
                data.ownedBy?.taux ?? 0,
                data.ownedBy?.nom ?? '',
                data.ownedBy?.prenom ?? '',
                data.ownedBy?.clients ?? [],
                data.ownedBy?.documents ?? [],
                data.ownedBy?.confirmPassword ?? undefined,
                data.ownedBy?.imageSinistre ?? undefined
            ),
            data.receiver
                ? new Clients(
                    data.receiver._id ?? '',  
                    data.receiver.email ?? '',  
                    data.receiver.password ?? '',  
                    data.receiver.image ?? '',  
                    data.receiver.phoneNumber ?? '',  
                    data.receiver.adresse ?? '',  
                    data.receiver.typeClient ?? 'PersonnePhysique',  
                    data.receiver.confirmPassword ?? undefined  
                )
                : new Clients('', '', '', '', '', '', 'PersonnePhysique') // Crée un client vide si null
        );
    }
    
    
}
