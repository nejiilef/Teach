import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCoursComponent } from './list-cours/list-cours.component';
import { AddCoursComponent } from './add-cours/add-cours.component';
import { UpdateCoursComponent } from './update-cours/update-cours.component';
import { InviteStudentComponent } from './invite-student/invite-student.component';
import { DeposerDocumentComponent } from './deposer-document/deposer-document.component';
import { teachHubGuard } from '../auth/guard/teach-hub.guard';

const routes: Routes = [
  { path : '' , component:ListCoursComponent,canActivate:[teachHubGuard]},
  { path : 'add' , component:AddCoursComponent,canActivate:[teachHubGuard]},
  { path : 'update/:id' , component:UpdateCoursComponent,canActivate:[teachHubGuard]},
  { path: 'invite-student', component: InviteStudentComponent ,canActivate:[teachHubGuard]},
  { path: 'deposer-document', component : DeposerDocumentComponent,canActivate:[teachHubGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursRoutingModule { }
