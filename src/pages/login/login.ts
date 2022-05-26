import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Facebook } from '@ionic-native/facebook';

import { AutenticacaoDTO } from '../../dev/models/autenticacao.dto';
import { AutenticacaoService } from '../../dev/services/autenticacao/autenticacao.service';
import { TokenDTO } from '../../dev/models/token.dto';
import { LocalStorageUsuarioService } from '../../dev/services/local-storage/local-storage-usuario.service';
import { LocalStorageTokenService } from '../../dev/services/local-storage/local-storage-token.service';
import { GuardiaoService } from '../../dev/services/autenticacao/guardiao.service';
import { UsuarioService } from '../../dev/services/model/usuario.service';
import { UsuarioPostDTO } from '../../dev/models/usuario-post.dto';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  public autenticacaoDTO: AutenticacaoDTO = new AutenticacaoDTO();
  public tokenAtual: TokenDTO = new TokenDTO();
  public carregar;
  public carregarFacebook;
  public usuarioPostDTO: UsuarioPostDTO = new UsuarioPostDTO();
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuController: MenuController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public formBuilder: FormBuilder,
    public autenticacaoService: AutenticacaoService,
    public usuarioService: UsuarioService,
    public guardiaoService: GuardiaoService,
    public lsUsuarioService: LocalStorageUsuarioService,
    public lsTokenService: LocalStorageTokenService,
    public facebook: Facebook,
  ) {
    this.inicializarLoginForm();
    this.inicializarDadosLocalStorage();
    
  }

  
  ionViewWillEnter() { // quando for entrar na página
    this.menuController.swipeEnable(false);
  }

  ionViewDidLeave() {  // quando já tiver saído da página
    this.menuController.swipeEnable(true);
  }

  inicializarLoginForm() {
    this.loginForm = this.formBuilder.group({
      login: [this.autenticacaoDTO.login, [Validators.required]],
      senha: [this.autenticacaoDTO.senha, [Validators.required]],
    });
  }

  inicializarDadosLocalStorage() {
    const lsUsuario = this.lsUsuarioService.getLocalStorageUsuario();
    if (lsUsuario == null) {
      this.lsUsuarioService.setLocalStorageUsuarioOFF();
      this.lsTokenService.setLocalStorageTokenOFF();
    } else if (lsUsuario.isLogado === false) {
      this.lsUsuarioService.setLocalStorageUsuarioOFF();
      this.lsTokenService.setLocalStorageTokenOFF();
    } else {
      this.navCtrl.setRoot('MenuPage');
    }
  }

  login() {
    this.setAutenticacaoDTO();
    //this.obterToken(); 
    this.efetuarLogin(); // login temporário até implementar o OAuth2.0
  }

  // sem Oauth2.0
  efetuarLogin() {
    this.abreCarregando();
    this.usuarioService.getLogin(this.autenticacaoDTO)
      .subscribe(retorno => {
        this.lsUsuarioService.setLocalStorageUsuario(retorno);
        this.logar();
        this.fechaCarregando();
      },
      error => {
        console.log(error.error['msg']);
        this.alertErroLogin(error.error['msg']);
        this.fechaCarregando();
      }
    );
  }


  obterUsuarioLogado() {
    this.autenticacaoService.getUsuarioLogado(this.autenticacaoDTO.login).subscribe(
      retorno => { 
          this.lsUsuarioService.setLocalStorageUsuario(retorno);
          this.logar();
      },
      error => {
        console.log(error);
      }
    );
  }


  logar() {
    this.navCtrl.setRoot('MenuPage').catch(
      err => {
        this.mostrarAlertAvisoLogout();
      }
    );
  }

  mostrarAlertAvisoLogout() {
    let alert = this.alertCtrl.create({
      title: 'Sessão expirou',
      message: 'Necessário realizar novo login!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.lsUsuarioService.setLocalStorageUsuarioOFF();
            this.lsTokenService.setLocalStorageTokenOFF();
            this.navCtrl.setRoot('MenuPage');
          }
        }
      ],
    });
    alert.present();
  }

  setAutenticacaoDTO() {
    this.autenticacaoDTO.login = this.loginForm.value['login'];
    this.autenticacaoDTO.senha = this.loginForm.value['senha'];
  }

  alertErroLogin(msg: string) {
    let alert = this.alertCtrl.create({
      title: 'Falha de autenticação',
      message: msg,
      enableBackdropDismiss: false,
      buttons: [
          {
              text: 'Ok'
          }
      ]
    });
    alert.present();
    this.lsUsuarioService.setLocalStorageUsuarioOFF();
    this.lsTokenService.setLocalStorageTokenOFF();
  }

  
  abreCarregando() {
    this.carregar = this.loadingController.create({
      content: "Por favor aguarde..."
    });
    this.carregar.present();
  }

  fechaCarregando() {
    this.carregar.dismiss();
  }

  /* obterToken() {
    this.abreCarregando();
    this.autenticacaoService.getAuthToken(this.autenticacaoDTO)
      .subscribe(retorno => {
        this.lsTokenService.setLocalStorageToken(retorno);
        this.obterUsuarioLogado();
        this.fechaCarregando();
      },
      error => {
        console.log(error);
        if(error['error_description'] === 'Bad credentials') {
          this.alertErroLogin();
        }
        this.fechaCarregando();
      }
    );
  } */

}
