import { Clients } from "./clients";

export class PersonneMorale extends Clients {
  private raisonSociale: string;
  private activite: string;
  private matricule_fiscal: string;

  constructor(
    _id: string,
    email: string,
    password: string,
    image: string,
    phoneNumber: string,
    adresse: string,
    raisonSociale: string,
    activite: string,
    matricule_fiscal: string,
    typeClient: 'PersonneMorale',
  ) {
    super(_id, email, password, image, phoneNumber, adresse, typeClient);
    this.raisonSociale = raisonSociale;
    this.activite = activite;
    this.matricule_fiscal = matricule_fiscal;
  }

  public get RaisonSociale(): string { return this.raisonSociale; }
  public set RaisonSociale(raison: string) { this.raisonSociale = raison; }

  public get Activite(): string { return this.activite; }
  public set Activite(activite: string) { this.activite = activite; }

  public get MatriculeFiscal(): string { return this.matricule_fiscal; }
  public set MatriculeFiscal(matricule: string) { this.matricule_fiscal = matricule; }
}
