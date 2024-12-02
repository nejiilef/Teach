import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDevoirComponent } from './list-devoir/list-devoir.component';
import { AddDevoirComponent } from './add-devoir/add-devoir.component';
import { UpdateCoursComponent } from '../cours/update-cours/update-cours.component';
import { UpdateDevoirComponent } from './update-devoir/update-devoir.component';
import { teachHubGuard } from '../auth/guard/teach-hub.guard';

const routes: Routes = [
  { path : 'list/:id' , component:ListDevoirComponent,canActivate:[teachHubGuard]},
  { path : 'add' , component:AddDevoirComponent,canActivate:[teachHubGuard]},
  { path : 'update/:id' , component:UpdateDevoirComponent,canActivate:[teachHubGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevoirRoutingModule { }
