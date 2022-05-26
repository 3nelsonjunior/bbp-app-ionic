import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarbeariaControleDiaPage } from './barbearia-controle-dia';
import { FolhinhaComponent } from '../../components/folhinha/folhinha.component';

@NgModule({
  declarations: [
    BarbeariaControleDiaPage,
    FolhinhaComponent,
  ],
  imports: [
    IonicPageModule.forChild(BarbeariaControleDiaPage),
  ],
})
export class BarbeariaControleDiaPageModule {}
