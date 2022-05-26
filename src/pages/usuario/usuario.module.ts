import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioPage } from './usuario';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    UsuarioPage,
  ],
  imports: [
    BrMaskerModule,
    IonicPageModule.forChild(UsuarioPage),
  ],
  entryComponents: [
  ],
  providers: [
    File,
    Transfer,
    Camera,
    FilePath,
  ]
})
export class UsuarioPageModule {}
