import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DevoirRenduService } from '../service/devoir-rendu.service';
import { IDevoirRendu } from '../model/idevoir-rendu';
import { DevoirService } from 'src/app/devoir/service/devoir.service';
import { IDevoir } from 'src/app/devoir/model/idevoir';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-evaluation-devoir',
  templateUrl: './evaluation-devoir.component.html',
  styleUrls: ['./evaluation-devoir.component.css']
})
export class EvaluationDevoirComponent implements OnInit {
//   evaluation: EvaluationDTO = {
//     idDevoirRendu: 0,
//     note: 0,
//     commentaire: '',
  
//   };
   idDevoir!: number;  // Variable pour stocker l'ID du devoir récupéré de l'URL
   devoirRendu!: IDevoirRendu;  // Variable pour stocker les détails du devoir rendu
   devoir!: IDevoir;  // Variable pour stocker les détails du devoir
  commentaire: string = '';  
  
  constructor(
    private fb:FormBuilder,
    private route: ActivatedRoute,
    private devoirRenduService: DevoirRenduService,
    private devoirserv : DevoirService
  ) {
    this.evaluationForm = this.fb.group({
      exercices: this.fb.array([]),
    });
  }

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       const idDevoirRenduString =params.get('idDevoirRendu');
//       const idDevoirString = params.get('id');
//       console.log('Paramètres récupérés - idDevoirRendu:', idDevoirRenduString, 'idDevoir:', idDevoirString);

  
//       if (idDevoirRenduString && idDevoirString) {
//         const idDevoirRendu = +idDevoirRenduString;
//         this.idDevoir = +idDevoirString;
//         console.log('APres convertion number - idDevoirRendu:', idDevoirRendu, 'idDevoir:', this.idDevoir);
//         // Appel pour récupérer les détails du devoir
//         this.devoirserv.getDevoirById(this.idDevoir).subscribe((devoir: IDevoir | null) => {
//           if (devoir) {
//             this.devoir = devoir;  // Stocker les détails du devoir dans la variable `devoir`
//             this.commentaire = devoir.bareme || '';
//             console.log('Détails du devoirrrrrrrrrr récupérés:', devoir);
//           } else {
//             console.error('Devoir non trouvé');
//           }
//         });
// console.log('hhhhhhhhhhhhhhhh',idDevoirRendu);
//         // Appel pour récupérer les détails du devoir rendu
//         this.devoirRenduService.getDevoirRenduById(idDevoirRendu).subscribe((devoirRendu: IDevoirRendu | null) => {
//           if (devoirRendu) {
//             this.devoirRendu = devoirRendu;  // Stocker les détails du devoir rendu dans la variable `devoirRendu`
//             this.evaluation.idDevoirRendu = idDevoirRendu;
//             this.evaluation.note = devoirRendu.note ?? 0;
//             this.evaluation.commentaire = devoirRendu.commentaire ?? '';
//           } else {
//             console.error('Devoir rendu non trouvé');
//           }
//         });
//       } else {
//         console.error('ID, ID Devoir Rendu ou ID Devoir manquants');
//       }
//     });
//   }
  

//   onSubmitEvaluation(form: any) {
//     if (form.valid) {
//       console.log("Données envoyées pour évaluation:", this.evaluation); // Journalisation

//       this.devoirRenduService.evaluerDevoir(this.evaluation).subscribe(
//         response => {
//           alert('Évaluation soumise avec succès');
//           console.log("Réponse du serveur:", response); // Journalisation
//         },
//         error => {
//           console.error('Erreur lors de la soumission de l\'évaluation', error);
//         }
//       );
//     }
//   }






evaluationForm: FormGroup;
  exercices: { name: string; maxNote: number }[] = [];
  totalNote: number = 0; // Note totale calculée
  idDevoirRendu!: number; // ID récupéré depuis l'URL

  evaluation: EvaluationDTO = {
    idDevoirRendu: 0,
    note: 0,
    commentaire: '',
  };

  

  ngOnInit(): void {
    // Récupérer `idDevoirRendu` depuis l'URL
    this.route.paramMap.subscribe(params => {
      const idDevoirRenduString =params.get('idDevoirRendu');
            const idDevoirString = params.get('id');
            console.log('Paramètres récupérés - idDevoirRendu:', idDevoirRenduString, 'idDevoir:', idDevoirString);
      
        
            if (idDevoirRenduString && idDevoirString) {
              const idDevoirRendu = +idDevoirRenduString;
              this.idDevoir = +idDevoirString;
              console.log('APres convertion number - idDevoirRendu:', idDevoirRendu, 'idDevoir:', this.idDevoir);
              // Appel pour récupérer les détails du devoir
              this.devoirserv.getDevoirById(this.idDevoir).subscribe((devoir: IDevoir | null) => {
                if (devoir) {
                  this.devoir = devoir;  // Stocker les détails du devoir dans la variable `devoir`
                  this.commentaire = devoir.bareme || '';
                  console.log('Détails du devoirrrrrrrrrr récupérés:', devoir);
                } else {
                  console.error('Devoir non trouvé');
                }
              });
      console.log('hhhhhhhhhhhhhhhh',idDevoirRendu);
              // Appel pour récupérer les détails du devoir rendu
              this.devoirRenduService.getDevoirRenduById(idDevoirRendu).subscribe((devoirRendu: IDevoirRendu | null) => {
                if (devoirRendu) {
                  this.devoirRendu = devoirRendu;  // Stocker les détails du devoir rendu dans la variable `devoirRendu`
                  this.evaluation.idDevoirRendu = idDevoirRendu;
                  this.evaluation.note = devoirRendu.note ?? 0;
                  this.evaluation.commentaire = devoirRendu.commentaire ?? '';
                } else {
                  console.error('Devoir rendu non trouvé');
                }
              });
            } else {
              console.error('ID, ID Devoir Rendu ou ID Devoir manquants');
            }
    });

    // Charger le barème depuis l'API
    this.devoirRenduService.getBareme(this.idDevoir).subscribe(data => {
      this.exercices = Object.entries(data).map(([name, maxNote]) => ({ name, maxNote }));
      this.createFormFields();
      this.updateTotalNote(); // Calcul initial
    });

    // Écouter les changements dans le formulaire pour recalculer la note totale
    this.evaluationForm.valueChanges.subscribe(() => {
      this.updateTotalNote();
    });
  }

  get exercicesArray(): FormArray {
    return this.evaluationForm.get('exercices') as FormArray;
  }

  createFormFields() {
    this.exercices.forEach(exercice => {
      this.exercicesArray.push(
        this.fb.group({
          name: [exercice.name],
          note: [0, [Validators.required, Validators.min(0), Validators.max(exercice.maxNote)]],
        })
      );
    });
  }

  updateTotalNote() {
    const notes = this.exercicesArray.value.map((control: any) => control.note || 0);
    this.totalNote = notes.reduce((sum: number, note: number) => sum + note, 0);
    this.evaluation.note = this.totalNote; // Mise à jour de la note dans EvaluationDTO
  }

  onSubmit() {
    if (this.evaluationForm.valid) {
      // Assembler le commentaire des exercices
      this.evaluation.commentaire = this.exercicesArray.value
        .map((control: any) => `${control.name} - Note: ${control.note}`)
        .join('\n');

      console.log('Données envoyées:', this.evaluation);

      // Envoyer au service
      this.devoirRenduService.evaluerDevoir(this.evaluation).subscribe(
                response => {
                  alert('Évaluation soumise avec succès');
                  console.log("Réponse du serveur:", response); // Journalisation
                },
                error => {
                  console.error('Erreur lors de la soumission de l\'évaluation', error);
                }
              );
    } else {
      alert('Veuillez corriger les erreurs dans le formulaire.');
    }
  }
}

interface EvaluationDTO {
  idDevoirRendu: number;
  note: number;
  commentaire: string;
} 
