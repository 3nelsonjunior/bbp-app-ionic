import { AngularFireModule } from "angularfire2";
import { BrowserModule } from '@angular/platform-browser';
import { Calendar } from '@ionic-native/calendar';
import { CalendarModule } from "ion2-calendar";
import { ErrorHandler, NgModule } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { HttpClientModule} from '@angular/common/http'
import { HttpModule } from '@angular/http';
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FIREBASE_CONFIG } from '../dev/config/firebase.config';

// import { AutenticacaoInterceptorService } from '../dev/interceptors/autenticacao.interceptor';
import { AutenticacaoService } from '../dev/services/autenticacao/autenticacao.service';
import { DateUtilService } from '../dev/services/util/date-util.service';
import { EnderecoService } from '../dev/services/model/endereco.service';
import { GuardiaoService } from '../dev/services/autenticacao/guardiao.service';
import { GenericUtilService } from "../dev/services/util/generic-util.service";
import { ImageUtilService } from '../dev/services/util/image-util.service';
import { LocalStorageTokenService } from '../dev/services/local-storage/local-storage-token.service';
import { LocalStorageUsuarioService } from '../dev/services/local-storage/local-storage-usuario.service';
import { UsuarioService } from '../dev/services/model/usuario.service';

import { DiaModal } from "../pages/util/modais/dia/dia.modal";
import { EmailNovaSenhaModal } from '../pages/util/modais/email-nova-senha/email-nova-senha.modal';
import { EnderecoModal } from '../pages/util/modais/endereco/endereco.modal';
import { SenhaModal } from '../pages/util/modais/senha/senha.modal';
import { CalendarioComponent } from "../components/calendario/calendario.component";


@NgModule({
  declarations: [
    MyApp,
    CalendarioComponent,
    DiaModal,
    EmailNovaSenhaModal,
    EnderecoModal,
    SenhaModal,
  ],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),  
    BrowserModule,
    CalendarModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    ReactiveFormsModule,
  ],
  exports: [
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CalendarioComponent,
    DiaModal,
    EmailNovaSenhaModal,
    EnderecoModal,
    SenhaModal,
  ],
  providers: [
    AutenticacaoService,
    // AutenticacaoInterceptorService,
    Calendar,
    DateUtilService,
    EnderecoService,
    Facebook,
    GenericUtilService,
    GuardiaoService,
    ImagePicker,
    ImageUtilService,
    LocalStorageUsuarioService,
    LocalStorageTokenService,
    SocialSharing,
    SplashScreen,
    StatusBar,
    UsuarioService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule {}
