import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../material.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
   
  ],
  imports: [
    MaterialModule,
    AuthRoutingModule,
     LoginComponent,
    RegisterComponent
  ]
})
export class AuthModule { }