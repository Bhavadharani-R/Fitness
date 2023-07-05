import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegListComponent } from './reg-list/reg-list.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  {path:'', redirectTo:'register',pathMatch:'full'},
  {path:'register', component:RegistrationComponent},
  {path:'list', component:RegListComponent},
  {path:'detail/:id', component:UserDetailComponent },
  {path:'update/:id', component:RegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
