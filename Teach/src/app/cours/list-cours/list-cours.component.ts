import { Component } from '@angular/core';
import { ICours } from '../model/icours';
import { CoursService } from '../service/cours.service';
import { Router } from '@angular/router';
import { IEnseignant } from 'src/app/auth/model/ienseignant';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-cours',
  templateUrl: './list-cours.component.html',
  styleUrls: ['./list-cours.component.css']
})
export class ListCoursComponent {
  moyenne!: number; // Cette variable contiendra la valeur calculée.
  moyennes: { [idCours: number]: number } = {};

  btStyle = {'border-radius': '4px', 'text-align': 'center'};
  coursList: any[] = [];
  courseCode: string = '';
  studentEmail: string = '';
  role = localStorage.getItem("role");
  documentsList: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  coursMap: Map<IEnseignant, ICours> = new Map();

  constructor(private service: CoursService, private router: Router) {}

  test!: boolean;

  ngDoCheck(): void {
    
  }
  ngOnInit(): void {
    this.test = localStorage.getItem('role') !== 'etudiant';
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('id');
    const userEmail = localStorage.getItem('email');
    
    if (role === 'enseignant' && userId && userEmail) {
      forkJoin([
        this.service.getCoursByEnseignantId(+userId),
        this.service.getCoursesForInvitedTeacher(userEmail)
      ]).subscribe(
        ([coursPrincipaux, coursInvites]) => {
          this.coursList = [...coursPrincipaux, ...coursInvites];
          this.coursList.forEach((cours) => {
            this.calculMoyenne(cours.idCours); // Appelle la fonction pour chaque cours
          });
        },
        (error) => console.error('Erreur lors de la récupération des cours', error)
      );
    } else if (role === 'etudiant' && userId) {
      this.service.getCoursByStudentId(+userId).subscribe(
        (cours) => {
          this.coursList = cours;
          this.coursList.forEach((cours) => {
            console.log(cours)
            this.calculMoyenne(cours.idCours); // Appelle la fonction pour chaque cours
            this.service.calculMoyenneGenerale(localStorage.getItem('email')!).subscribe(m=>this.moyenne=m)
          });
        },
        (error) => console.error('Erreur lors de la récupération des cours pour l\'étudiant', error)
      );
    }
  }
  
  
  getCoursesForInvitedTeacher(teacherEmail: string) {
    this.service.getCoursesForInvitedTeacher(teacherEmail).subscribe(
      (cours) => {
        this.coursList = cours;
      },
      (error) => {
        console.error("Erreur lors de la récupération des cours pour l'enseignant invité", error);
      }
    );
  }

  deleteCours(id: number) {
    this.service.deleteCours(id).subscribe((response) => {
      this.ngOnInit();
    });
  }

  joinCourse() {
    this.errorMessage = ''; // Réinitialise le message d'erreur avant de rejoindre
    this.successMessage = ''; // Réinitialise le message de succès avant de rejoindre
  
    if (this.courseCode.trim()) {
      const studentId = localStorage.getItem("id"); 
      if (studentId) {
        this.service.inviteStudentById(this.courseCode, +studentId).subscribe(
          (response) => {
            console.log('Cours rejoint avec succès :', response);
            this.successMessage = 'Vous avez rejoint le cours avec succès.';
            this.ngOnInit(); 
          },
          (error) => {
            console.error('Erreur lors de la tentative de rejoindre le cours :', error);
            if (error.status === 400) {
              this.errorMessage = 'Erreur lors de la tentative de rejoindre le cours .'; // Utiliser le message d'erreur renvoyé par le backend
            } else {
              this.successMessage = 'Vous avez rejoint le cours avec succès.';
            }
          }
        );
      }
    }
  }
  

  

  onSelectCourse(coursId: number) {
    localStorage.setItem("courId", coursId.toString());
    
    const enseignant = this.coursList.find(c => c.idCours === coursId)?.enseignantId; // Assurez-vous que 'enseignantId' est bien la clé
    if (enseignant) {
      localStorage.setItem("enseignantId", enseignant.toString());
    } else {
        console.error('Aucun enseignant trouvé pour le cours:', coursId);
    }

    this.router.navigate(['/cours/deposer-document']);
  }
  calculMoyenne(idCours: number): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.service.calculMoyenne(idCours, email).subscribe(
        (response) => {
          this.moyennes[idCours] = response; // Stocke la moyenne pour ce cours
        },
        (error) => {
          console.error(`Erreur lors du calcul de la moyenne pour le cours ${idCours}:`, error);
          this.moyennes[idCours] = 0; // Valeur par défaut en cas d'erreur
        }
      );
    }
  }
  
  showPopup: boolean = false; // Contrôle l'affichage du popup
 
  togglePopup() {
    this.showPopup = !this.showPopup; // Inverse l'état du popup
  }
}
