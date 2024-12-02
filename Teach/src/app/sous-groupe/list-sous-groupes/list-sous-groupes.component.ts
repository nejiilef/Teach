import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SousGroupeService } from '../service/sous-groupe.service';
import { Router } from '@angular/router';
import { CoursService } from 'src/app/cours/service/cours.service';
import { NgForm } from '@angular/forms';
import { EtudiantService } from 'src/app/etudiants/services/etudiant.service';

import { DevoirRenduDetails } from 'src/app/devoir-rendu/model/DevoirRenduDetails';
@Component({
  selector: 'app-list-sous-groupes',
  templateUrl: './list-sous-groupes.component.html',
  styleUrls: ['./list-sous-groupes.component.css']
})
export class ListSousGroupesComponent implements OnInit {
  sgList!: any[];
  allEtudiants!: any[];
  allEtudiantsSg!: any[];
  etudiants!: any[];
  isPopupVisible = false;
  selectedEtudiant: any;
  idSg!: number;
  selectedEtudiantId: number | null = null;
  
  DevoirRenduDetails: DevoirRenduDetails[] = [];

  constructor(private etudiantService: EtudiantService,private service: SousGroupeService, private router: Router, private serviceCours: CoursService,private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.serviceCours.getCoursById(+localStorage.getItem("idCours")!).subscribe((c) => {
      this.allEtudiants = c?.students!;
    });
    this.service.getAllSousgroupes(+localStorage.getItem("idCours")!).subscribe((sg) => {
      this.sgList = sg;
    }, (error) => {
      console.error('Error fetching cours', error);
    });
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  ajouterEtudiant(f: NgForm) {
    if (this.selectedEtudiant) {
      this.service.addEtudiantSousGroupe(this.idSg, this.selectedEtudiant).subscribe(
        (response) => {
          console.log('Étudiant ajouté avec succès');
          this.closePopup();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'étudiant', error);
        }
      );
    }
  }

  onEtudiantSelect(etudiant: any) {
    this.selectedEtudiant = etudiant;
  }

  showPopup(idSousGroupe: number): void {
    this.isPopupVisible = true;
  
    // Fetch sous-groupe students
    this.service.getSousgroupeById(idSousGroupe).subscribe(sousGroupe => {
      this.allEtudiantsSg = sousGroupe!.etudiants || []; // Ensure it's always an array
  
      // Assuming allEtudiants is defined earlier in your component
      if (this.allEtudiants) {
        // Safely filter the students who are not in the current sous-groupe
        this.allEtudiants = this.allEtudiants.filter(student =>
          !this.allEtudiantsSg.some(sgStudent => sgStudent.email === student.email)
        );
      }
    });}
  toggleEtudiants(idSousGroupe: number) {
    const subgroup = this.sgList.find(sg => sg.idSousGroupe === idSousGroupe);
    if (subgroup) {
      subgroup.showEtudiants = !subgroup.showEtudiants; // Toggle visibility
    }
  }
  selectEtudiant(id: number): void {
    this.selectedEtudiantId = id;
    this.isPopupVisible = true;
    console.log('Étudiant sélectionné avec ID :', id);
  
    // Récupérer l'ID du cours depuis le localStorage
    const coursId = +localStorage.getItem("idCours")!;
    console.log('ID du cours récupéré du localStorage :', coursId);
  
    // Appeler le service pour récupérer les devoirs rendus
    this.etudiantService.getDevoirsrenduWithCommentsAndNotes(coursId, id).subscribe(
      (DevoirRenduDetails: DevoirRenduDetails[]) => {
        // Stocker les devoirs rendus dans une variable
        this.DevoirRenduDetails = DevoirRenduDetails;
        console.log('Devoirs rendus récupérés avec succès :', DevoirRenduDetails);
      },
      (error: any) => {
        // Gestion des erreurs
        console.error('Erreur lors de la récupération des devoirs rendus :', error);
      }
    );
  }
  
  trackByEmail(index: number, item: any): string {
    return item.email; // Utilisez l'email ou un autre identifiant unique
  }
}
