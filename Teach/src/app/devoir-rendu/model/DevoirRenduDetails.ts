export class DevoirRenduDetails {
    idDevoir: number;
    typedevoir: string;
    description: string;
    ponderation: number;
    bareme: string;
    dateLimite: Date;
    statut: string;
    maxDocuments: number;
    commentaire: string;
    note: number;
    
  
    constructor(
      idDevoir: number,
      typedevoir: string,
      description: string,
      ponderation: number,
      bareme: string,
      dateLimite: Date,
      statut: string,
      maxDocuments: number,
      commentaire: string,
      note: number,
      
    ) {
      this.idDevoir = idDevoir;
      this.typedevoir = typedevoir;
      this.description = description;
      this.ponderation = ponderation;
      this.bareme = bareme;
      this.dateLimite = dateLimite;
      this.statut = statut;
      this.maxDocuments = maxDocuments;
      this.commentaire = commentaire;
      this.note = note;
     
    }
  }
  