import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { UsuarioCadastroPage } from './usuario-cadastro';


@NgModule({
  declarations: [
    UsuarioCadastroPage,
  ],
  imports: [
    BrMaskerModule,
    IonicPageModule.forChild(UsuarioCadastroPage),
  ],
  entryComponents: [
  ],
  providers: [
    //
  ]
})
export class UsuarioPageModule {}
