// src/app/models/etudiant.model.ts

export interface Etudiant {
    id: number;          // L'ID de l'étudiant (Long en Java, traité comme number en TypeScript)
    nom: string;         // Le nom de l'étudiant
    prenom: string;      // Le prénom de l'étudiant
    email: string;       // L'email de l'étudiant
    motDePasse: string;  // Le mot de passe de l'étudiant
  }
  