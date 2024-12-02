// src/app/components/etudiants/etudiants.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Etudiant } from './model/etudiant';
import { EtudiantService } from './services/etudiant.service';
import { IDevoirRendu } from '../devoir-rendu/model/idevoir-rendu';
import { DevoirRenduDetails } from '../devoir-rendu/model/DevoirRenduDetails';


@Component({
  selector: 'app-etudiants',
  templateUrl: './etudiants.component.html',
  styleUrls: ['./etudiants.component.css']
})
export class EtudiantsComponent implements OnInit {
  courId!: number;  // ID du cours
  etudiants: Etudiant[] = [];  // Liste des étudiants
  selectedEtudiantId: number | null = null;
  DevoirRenduDetails: DevoirRenduDetails[] = [];
  isPopupVisible = false;
  constructor(
    private etudiantService: EtudiantService,  // Injection du service
    private route: ActivatedRoute  // Pour récupérer l'ID du cours depuis l'URL
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du cours à partir de l'URL
    this.route.params.subscribe(params => {
      this.courId = +params['courId'];  // Extraire l'ID du cours de l'URL
      this.getEtudiants();  // Appel à la méthode pour récupérer les étudiants
    });
  }

  // Méthode pour récupérer les étudiants d'un cours
  getEtudiants(): void {
    this.etudiantService.getEtudiantsByCourId(this.courId).subscribe(
      (etudiants: Etudiant[]) => {
        this.etudiants = etudiants;  // Stocker les étudiants dans la variable
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des étudiants :', error);
      }
    );
  }
  selectEtudiant(id: number): void {
    this.selectedEtudiantId = id;
    this.isPopupVisible = true; 
    console.log('Étudiant sélectionné avec ID :', id);
    
    // Appeler le service pour récupérer les devoirs rendus
    this.etudiantService.getDevoirsrenduWithCommentsAndNotes(this.courId, id).subscribe(
      (DevoirRenduDetails: DevoirRenduDetails[]) => {
        this.DevoirRenduDetails = DevoirRenduDetails;  // Stocker les devoirs rendus
        console.log('Devoirs rendus :', DevoirRenduDetails);
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des devoirs rendus :', error);
      }
    );
  }
  fetchDevoirRenduDetails(etudiantId: number): void {
    // Remplir avec les données appropriées
    this.DevoirRenduDetails = []; // Exemple : données à remplir
  }

  // Fonction pour fermer la fenêtre modale
  closePopup(): void {
    this.isPopupVisible = false;
    this.selectedEtudiantId = null;
  }


}
