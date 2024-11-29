import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICours } from '../model/icours';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursService } from '../service/cours.service';
import { ICoursDTO } from '../model/icours-dto';

@Component({
  selector: 'app-update-cours',
  templateUrl: './update-cours.component.html',
  styleUrls: ['./update-cours.component.css']
})
export class UpdateCoursComponent implements OnInit {
  UpdateCoursForm!: FormGroup;
  cours!: ICours;
  submitted = false;
  role = localStorage.getItem("role");

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: CoursService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((parametres) => {
      const idCours = +parametres['id'];
      this.service.getCoursById(idCours).subscribe((c) => {
        if (c) {
          this.cours = c;
          this.initializeForm();
        }
      });
    });
  }

  initializeForm(): void {
    // Typing the form group explicitly
    this.UpdateCoursForm = this.formBuilder.group({
      nom: [this.cours.nom, [Validators.required]],
      coefficient: [this.cours.coefficient, [Validators.required, Validators.pattern('^[0-9]+$')]], // Valide que c'est un nombre
      credits: [this.cours.credits, [Validators.required, Validators.pattern('^[0-9]+$')]], // Valide que c'est un nombre
    });
  }

  updateCours(): void {
    this.submitted = true;

    if (this.UpdateCoursForm.invalid) {
      return;
    }

    const values = this.UpdateCoursForm.value;
    const updatedCours: ICoursDTO = {
      nom: values['nom'], // Accès avec la syntaxe []
      coefficient: values['coefficient'],
      credits: values['credits'],
    };

    console.log('Updated Cours DTO:', updatedCours); // Vérifiez les valeurs dans la console

    this.service.updateCours(updatedCours, this.cours.idCours).subscribe(() => {
      this.router.navigate(['cours']);
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.updateCours();
  }
}
