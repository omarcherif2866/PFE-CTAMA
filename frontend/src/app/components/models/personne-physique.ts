import { Clients } from "./clients";

export class PersonnePhysique extends Clients {
    private nom: string;
    private prenom: string;
    private birthDate: string;
    private numeroPermis: string;
    private identifiant_national: string;
    private CIN_Pass: string;
    private sex: 'homme' | 'femme';
    private nationalite: string;
    private profession: string;
  
    constructor(
      _id: string,
      email: string,
      password: string,
      image: string,
      phoneNumber: string,
      adresse: string,
      nom: string,
      prenom: string,
      birthDate: string,
      numeroPermis: string,
      identifiant_national: string,
      CIN_Pass: string,
      sex: 'homme' | 'femme',
      nationalite: string,
      profession: string,
      typeClient: 'PersonnePhysique',
    ) {
      super(_id, email, password, image, phoneNumber, adresse, typeClient);
      this.nom = nom;
      this.prenom = prenom;
      this.birthDate = birthDate;
      this.numeroPermis = numeroPermis;
      this.identifiant_national = identifiant_national;
      this.CIN_Pass = CIN_Pass;
      this.sex = sex;
      this.nationalite = nationalite;
      this.profession = profession;
    }
  
    public get Nom(): string { return this.nom; }
    public set Nom(nom: string) { this.nom = nom; }
  
    public get Prenom(): string { return this.prenom; }
    public set Prenom(prenom: string) { this.prenom = prenom; }
  
    public get BirthDate(): string { return this.birthDate; }
    public set BirthDate(birthDate: string) { this.birthDate = birthDate; }
  
    public get NumeroPermis(): string { return this.numeroPermis; }
    public set NumeroPermis(numeroPermis: string) { this.numeroPermis = numeroPermis; }
  
    public get IdentifiantNational(): string { return this.identifiant_national; }
    public set IdentifiantNational(identifiant: string) { this.identifiant_national = identifiant; }
  
    public get CINPass(): string { return this.CIN_Pass; }
    public set CINPass(cinPass: string) { this.CIN_Pass = cinPass; }
  
    public get Sex(): 'homme' | 'femme' { return this.sex; }
    public set Sex(sex: 'homme' | 'femme') { this.sex = sex; }
  
    public get Nationalite(): string { return this.nationalite; }
    public set Nationalite(nationalite: string) { this.nationalite = nationalite; }
  
    public get Profession(): string { return this.profession; }
    public set Profession(profession: string) { this.profession = profession; }
}

