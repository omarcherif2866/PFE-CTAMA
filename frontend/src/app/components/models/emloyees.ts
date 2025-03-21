
export class Emloyees {
    private _id: string;
    private email: string;
    private password: string;
    private confirmPassword?: string;
    private image: string;
    private phoneNumber: string;
    private poste: string;
    private departement: string;
    private nom: string;
    private prenom: string;

  
    constructor(
      _id: string,
      email: string,
      password: string,
      image: string,
      phoneNumber: string,
      poste: string,
      departement: string,
      nom: string,
      prenom: string,
      confirmPassword?: string
    ) {
      this._id = _id;
      this.email = email;
      this.password = password;
      this.image = image;
      this.phoneNumber = phoneNumber;
      this.nom = nom;
      this.prenom = prenom;
      this.departement = departement;
      this.poste = poste;
      this.confirmPassword = confirmPassword;
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

    public get Poste(): string {
      return this.poste;
    }
  
    public set Poste(poste: string) {
      this.poste = poste;
    }

    public get Departement(): string {
      return this.departement;
    }
  
    public set Departement(departement: string) {
      this.departement = departement;
    }
    
  }
