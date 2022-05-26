import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController, ModalController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacaoDTO } from '../../dev/models/autenticacao.dto';
import { TokenDTO } from '../../dev/models/token.dto';
import { UsuarioPostDTO } from '../../dev/models/usuario-post.dto';
import { LocalStorageUsuarioService } from '../../dev/services/local-storage/local-storage-usuario.service';
import { LocalStorageTokenService } from '../../dev/services/local-storage/local-storage-token.service';
import { Facebook } from '@ionic-native/facebook';
import { UsuarioService } from '../../dev/services/model/usuario.service';
import { EmailNovaSenhaModal } from '../util/modais/email-nova-senha/email-nova-senha.modal';

@IonicPage()
@Component({
  selector: 'page-login-slides',
  templateUrl: 'login-slides.html',
})
export class LoginSlidesPage {

  public loginForm: FormGroup;
  public autenticacaoDTO: AutenticacaoDTO = new AutenticacaoDTO();
  public tokenAtual: TokenDTO = new TokenDTO();
  public carregar;
  public carregarFacebook;
  public usuarioPostDTO: UsuarioPostDTO = new UsuarioPostDTO();
  public backgrounds = [
    'assets/imgs/background/background-1.jpg',
    // 'assets/imgs/background/background-2.jpg',
    // 'assets/imgs/background/background-3.jpg',
  ]

  
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public menuController: MenuController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public usuarioService: UsuarioService,
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

  obterLoginFacebook() {
    let permissions = new Array<string>();
    permissions = ["public_profile", "email"];
    this.facebook.login(permissions).then((response) => {
      let params = new Array<string>();
      this.facebook.api("/me?fields=name,email", params)
        .then(res => {
          this.usuarioPostDTO.nome = res.name;
          this.usuarioPostDTO.email = res.email;
          this.efetuarLoginFacebook();
        }, (error) => {
          console.log('ERRO LOGIN: ', error);
          this.alertErroFacebook();
        })
    }, (error) => {
      console.log('ERRO LOGIN: ', error);
      this.alertErroFacebook();
    });
  }

  efetuarLoginFacebook() {
    this.abreCarregando();
    this.usuarioService.getLoginFacebook(this.usuarioPostDTO.email)
      .subscribe(retorno => {
        this.lsUsuarioService.setLocalStorageUsuario(retorno);
        this.logar();
        this.fechaCarregando();
      },
      error => {
        console.log(error);
        this.alertErroNovoUsuario();
        this.fechaCarregando();
      }
    );
  }

  efetuarLogin() {
    this.abreCarregando();
    this.usuarioService.getLogin(this.autenticacaoDTO)
      .subscribe(retorno => {
        this.lsUsuarioService.setLocalStorageUsuario(retorno);
        this.logar();
        this.fechaCarregando();
      },
      error => {
        console.log(error);
        this.alertErroLogin();
        this.fechaCarregando();
      }
    );
  }

  obterLoginGoogle() {

  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  logar() {
    this.navCtrl.setRoot('MenuPage').catch(
      err => {
        this.alertAvisoLogout();
      }
    );
  }

  cadastrar(usuarioPostDTO: UsuarioPostDTO) {
    usuarioPostDTO = this.usuarioPostDTO;
    this.navCtrl.push('UsuarioCadastroPage', { usuarioPostDTO });
  }

  recuperarSenha() {
    console.log('recuperar senha');
    this.alertRecuperarSenha('OK', 'Senha foi enviada para o email cadastrado');
  }

  alertRecuperarSenha(titulo: string, mensagem: string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensagem,
      buttons: [
        {
          text: 'OK',
        }
      ],
    });
    alert.present();
  }

  alertErroNovoUsuario() {
    let confirm = this.alertCtrl.create({
      title: 'Usuário não cadastrado!!!',
      message: 'Deseja cadastrar seu usuário?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            this.navCtrl.setRoot('LoginPage');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.cadastrar(this.usuarioPostDTO); 
          }
        }
      ]
    });
    confirm.present();
  }

  alertAvisoLogout() {
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

  alertErroLogin() {
    let alert = this.alertCtrl.create({
      title: 'Falha de autenticação',
      message: 'Usuário ou senha incorretos!',
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

  alertErroFacebook() {
    let alert = this.alertCtrl.create({
      title: 'Falha de comunicação',
      message: 'Ocorreu um erro na tentativa de comunicação com Facebook,' +
                + 'por favor, verifique se seu dipositivo está conectado no app do Facebbook e tente novamente!',
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

  abrirModalRecuperarSenha() {
    let modal = this.modalCtrl.create(EmailNovaSenhaModal);
    modal.onDidDismiss(resposta => {
      if (resposta !== 'cancelar') {
        this.toastCtrl.create({
          message: resposta,
          duration: 3000,
        }).present();
      }
    });
    modal.present();
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


}
