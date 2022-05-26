import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/module';

import { LoginPage } from './login';
import { AutenticacaoService } from '../../dev/services/autenticacao/autenticacao.service';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
  providers: [
    AutenticacaoService,
  ],
})
export class LoginPageModule {}
