import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginSlidesPage } from './login-slides';

@NgModule({
  declarations: [
    LoginSlidesPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginSlidesPage),
  ],
})
export class LoginSlidesPageModule {}
