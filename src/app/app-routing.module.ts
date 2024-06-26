import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardbodyComponent } from './dashboard/dashboardbody/dashboardbody.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardbodyComponent,
    pathMatch: "full"
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 

}
