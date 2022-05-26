import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdmPage } from './adm';

@NgModule({
  declarations: [
    AdmPage,
  ],
  imports: [
    IonicPageModule.forChild(AdmPage),
  ],
})
export class AdmPageModule {}
