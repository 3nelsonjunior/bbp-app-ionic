import { UsuarioLogadoDTO } from './../../dev/models/usuario-logado.dto';
import { PageInterface } from './menu';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Platform, AlertController } from 'ionic-angular';
import { LocalStorageUsuarioService } from '../../dev/services/local-storage/local-storage-usuario.service';
import { LocalStorageTokenService } from '../../dev/services/local-storage/local-storage-token.service';
import { GuardiaoService } from '../../dev/services/autenticacao/guardiao.service';
import { API_CONFIG } from '../../dev/config/api.config';
import { UsuarioService } from '../../dev/services/model/usuario.service';
import { DomSanitizer } from '@angular/platform-browser';


export interface PageInterface {
  titulo: string,
  nomeComponent: string,
  icon: string,
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = 'HomePage';
  fotoUsuario;

  public usuarioLogado: UsuarioLogadoDTO = new UsuarioLogadoDTO();

  paginas: PageInterface[] = [
    { titulo: 'Home', nomeComponent: 'HomePage', icon: 'ios-home' },
    { titulo: 'Barbearia', nomeComponent: 'BarbeariaPage', icon: 'ios-cut' },
    { titulo: 'Barber-Shop', nomeComponent: 'LojaPage', icon: 'ios-cart' },
    { titulo: 'Adm', nomeComponent: 'AdmPage', icon: 'ios-briefcase' },
    { titulo: 'Configurações', nomeComponent: 'ConfiguracoesPage', icon: 'ios-settings' },
    { titulo: 'Sobre o App', nomeComponent: 'SobrePage', icon: 'ios-information-circle' },
    { titulo: 'Sair', nomeComponent: 'SobrePage', icon: 'ios-close' },
  ];

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public sanitizer: DomSanitizer,
    public lsUsuarioService: LocalStorageUsuarioService,
    public lsTokenService: LocalStorageTokenService,
    public guardiaoService: GuardiaoService,
    public usuarioService: UsuarioService,
  ) {
      this.inicializarMenu();
  }

  ionViewCanEnter() {
    if(this.guardiaoService.existeUsuarioLogado()) {
      return true;
    } else {
      return false;
    }    
  }

  inicializarMenu() {
    this.usuarioLogado = this.lsUsuarioService.getLocalStorageUsuario().usuarioLogado;
    this.inicializarFoto();
  }

  inicializarFoto() {
    if(this.usuarioLogado.urlFoto  == 'avatar-default'){
      this.fotoUsuario = 'assets/imgs/avatar-default/avatar-default.png';
    } else {
      this.fotoUsuario = this.usuarioLogado.urlFoto;
    }
  }

  abrirPagina(pagina) {
    this.inicializarMenu();
    if (pagina.titulo === 'Sair') {
      this.sair();
    } else {
      this.nav.setRoot(pagina.nomeComponent).catch(
        err => {
          this.mostraralertAvisoLogout();
        }
      );
    }
  }

  alterarMeusDados() {
    this.inicializarMenu();
    this.nav.setRoot('UsuarioPage').catch(
      err => {
        this.mostraralertAvisoLogout();
      }
    );
  }

  mostraralertAvisoLogout() {
    let alert = this.alertCtrl.create({
      title: 'Sessão expirou',
      message: 'Necessário realizar novo login!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.logout();
          }
        }
      ],
    });
    alert.present();
  }

  logout() {
    this.lsUsuarioService.setLocalStorageUsuarioOFF();
    this.lsTokenService.setLocalStorageTokenOFF();
    this.nav.setRoot('LoginSlidesPage');
  }

  sair() {
    this.platform.exitApp();
  }

}
