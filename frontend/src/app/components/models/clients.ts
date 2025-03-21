export class Clients {
    private _id: string;
    private email: string;
    private password: string;
    private confirmPassword?: string;
    private image: string;
    private phoneNumber: string;
    private adresse: string;
    private typeClient: 'PersonnePhysique' | 'PersonneMorale';
  
    constructor(
      _id: string,
      email: string,
      password: string,
      image: string,
      phoneNumber: string,
      adresse: string,
      typeClient: 'PersonnePhysique' | 'PersonneMorale',
      confirmPassword?: string
    ) {
      this._id = _id;
      this.email = email;
      this.password = password;
      this.image = image;
      this.phoneNumber = phoneNumber;
      this.adresse = adresse;
      this.typeClient = typeClient;
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
  
    public get Adresse(): string {
      return this.adresse;
    }
  
    public set Adresse(adresse: string) {
      this.adresse = adresse;
    }

    public get Type(): string {
      return this.typeClient;
    }
  
    public set Type(typeClient: 'PersonnePhysique' | 'PersonneMorale') {
      this.typeClient = typeClient;
    }

    
    public get Image(): string {
      return this.image;
    }
  
    public set Image(image: string) {
      this.image = image;
    }
    
  }
