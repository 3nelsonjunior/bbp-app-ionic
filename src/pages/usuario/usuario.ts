import { UsuarioLogadoDTO } from './../../dev/models/usuario-logado.dto';
import { EnderecoDTO } from './../../dev/models/endereco.dto';
import { Component, ViewChild, Inject } from '@angular/core';
import {
  NavController, NavParams, AlertController, FabContainer,
  ToastController, ActionSheetController, IonicPage, Platform, ModalController, Nav, LoadingController
} from 'ionic-angular';

import { UsuarioService } from '../../dev/services/model/usuario.service';
import { UsuarioDTO } from '../../dev/models/usuario.dto';
import { LocalStorageUsuarioService } from '../../dev/services/local-storage/local-storage-usuario.service';
import { LocalStorageTokenService } from '../../dev/services/local-storage/local-storage-token.service';
import { GuardiaoService } from '../../dev/services/autenticacao/guardiao.service';
import { API_CONFIG } from '../../dev/config/api.config';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { EnderecoModal } from '../util/modais/endereco/endereco.modal';
import { SenhaModal } from '../util/modais/senha/senha.modal';
import { UsuarioPutDTO } from '../../dev/models/usuario-put.dto';
import { EnderecoService } from '../../dev/services/model/endereco.service';
import { FirebaseApp } from 'angularfire2';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FieldMessage } from '../../dev/models/filed-message.dto';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage {

  public usuarioForm: FormGroup;

  public segmentUsuario: string = 'segmentAbaDadosBasicos';
  public usuarioLogado: UsuarioLogadoDTO = new UsuarioLogadoDTO();
  public usuario: UsuarioDTO = new UsuarioDTO();
  public usuarioPutDTO: UsuarioPutDTO = new UsuarioPutDTO();
  public usuarioPutAuxDTO: UsuarioPutDTO = new UsuarioPutDTO();
  public endereco: EnderecoDTO = new EnderecoDTO();
  public listaEndereco: EnderecoDTO[];
  public desabilitarEdicao: boolean = true;
  public corBotaoSalvar: string = 'gold';
  public corBotaoHabilitarEdicao: string = 'gold';
  public carregar;
  public mensagemErro: string[] = [];
  public existeCamposObrigatoriosInvalidos = false;
  public foto;

  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;

  constructor(
    public platform: Platform,
    public navParams: NavParams,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public loadingController: LoadingController,
    public formBuilder: FormBuilder,
    public camera: Camera,
    public transfer: Transfer,
    public file: File,
    public filePath: FilePath,
    public sanitizer: DomSanitizer,
    public usuarioService: UsuarioService,
    public enderecoService: EnderecoService,
    public lsUsuarioService: LocalStorageUsuarioService,
    public lsTokenService: LocalStorageTokenService,
    public guardiaoService: GuardiaoService,
    public fb: FirebaseApp,
  ) {
    this.usuarioLogado = lsUsuarioService.getLocalStorageUsuario().usuarioLogado;
    this.inicializarFoto();
    this.inicializarUsuarioForm();
  }

  ionViewCanEnter() {
    if(this.guardiaoService.existeUsuarioLogado()) {
      return true;
    } else {
      return false;
    }    
  }

  ionViewDidEnter() {
    this.obterUsuario();
  }

  inicializarFoto() {
    if(this.usuarioLogado.urlFoto == 'avatar-default'){
      this.foto = 'assets/imgs/avatar-default/avatar-default.png';
    } else {
      this.foto = this.usuarioLogado.urlFoto;
    }
  }

  inicializarUsuarioForm() {
    this.usuarioForm = this.formBuilder.group({
        id: [this.usuarioPutDTO.id],
        nome: [this.usuarioPutDTO.nome, [Validators.required , Validators.minLength(3)]],
        apelido: [this.usuarioPutDTO.apelido, [Validators.required, Validators.minLength(3)]],
        dtNasc: [this.usuarioPutDTO.dtNasc, [Validators.required]],
        email: [this.usuarioPutDTO.email, [Validators.required,  Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
        telefone1: [this.usuarioPutDTO.telefone1, [Validators.required , Validators.minLength(3)]],
        telefone2: [this.usuarioPutDTO.telefone2, [Validators.minLength(3)]],
        telefone3: [this.usuarioPutDTO.telefone3, [Validators.minLength(3)]],
    });
}

  obterUsuario() {
    this.abreCarregando();
    this.usuarioService.getUsuarioPorId(this.usuarioLogado.id)
      .subscribe(resposta => {
        this.usuario = resposta;
        this.preencherUsuarioPutDTO();
        this.preencherUsuarioPutAuxDTO();
        this.preencherUsuarioForm();
        this.atualizarUsuarioLogado(this.usuario)
        this.obterListaEnderecoPorUsuario();
        this.fechaCarregando();
      },
        error => {
          this.alertErroBuscarUsuario();
          this.fechaCarregando();
        }
      );
  }

  preencherUsuarioForm() {
    this.usuarioForm.patchValue({
      id: this.usuarioPutDTO.id,
      nome: this.usuarioPutDTO.nome,
      apelido: this.usuarioPutDTO.apelido,
      dtNasc: this.usuarioPutDTO.dtNasc,
      email: this.usuarioPutDTO.email,
      telefone1: this.usuarioPutDTO.telefone1,
      telefone2: this.usuarioPutDTO.telefone2,
      telefone3: this.usuarioPutDTO.telefone3,
    });
  }

  obterListaEnderecoPorUsuario() {
    this.enderecoService.getListaEnderecoPorUsuario(this.usuarioLogado.id)
      .subscribe(resposta => {
        this.listaEndereco = resposta;
      },
        error => {
         console.log(error);
        }
      );
  }

  atualizarUsuarioLogado(usuario: UsuarioDTO) {
    this.usuarioLogado.nome = usuario.nome;
    this.usuarioLogado.apelido = usuario.apelido;
    this.usuarioLogado.urlFoto = usuario.urlFoto;
    this.usuarioLogado.perfis = usuario.perfis;
    this.lsUsuarioService.setLocalStorageUsuario(this.usuarioLogado);
  }

  alertErroBuscarUsuario() {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      message: 'Usuário não foi encontrado!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  habilitarDesabilitarEdicao() {
    if (this.desabilitarEdicao) {
      this.corBotaoSalvar = 'secondary';
      this.corBotaoHabilitarEdicao = 'danger';
      this.desabilitarEdicao = false;
    } else {
      this.usuarioPutDTO = this.usuarioPutAuxDTO;
      this.preencherUsuarioForm();
      this.desabilitarEdicao = true;
      this.corBotaoSalvar = 'gold';
      this.corBotaoHabilitarEdicao = 'gold';
    }
  }

  confirmarAlterarUsuario(event, fab: FabContainer) {
    if(this.existeCamposObrigatoriosInvalidos) {
      this.mostrarAlertCamposObrigatoriosInvalidos();
    } else {
      fab.close();
      this.desabilitarEdicao = true;
      this.corBotaoSalvar = 'gold';
      this.corBotaoHabilitarEdicao = 'gold';
      this.usuarioPutDTO = this.usuarioForm.value;
      this.mostraralertConfirmarAlterar();
      this.existeCamposObrigatoriosInvalidos = false;
    }
  }

  mostrarAlertCamposObrigatoriosInvalidos() {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      message: 'Existem campos obrigatórios inválidos!(OBS.: destacados em vermelho)',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // nada
          }
        }
      ]
    });
    alert.present();
  }

  preencherUsuarioPutDTO() {
    this.usuarioPutDTO.id = this.usuario.id;
    this.usuarioPutDTO.nome = this.usuario.nome;
    this.usuarioPutDTO.apelido = this.usuario.apelido;
    this.usuarioPutDTO.dtNasc = this.usuario.dtNasc;
    this.usuarioPutDTO.email = this.usuario.email;
    this.usuarioPutDTO.telefone1 = this.usuario.telefone1;
    this.usuarioPutDTO.telefone2 = this.usuario.telefone2;
    this.usuarioPutDTO.telefone3 = this.usuario.telefone3;
  }

  preencherUsuarioPutAuxDTO() {
    this.usuarioPutAuxDTO.id = this.usuario.id;
    this.usuarioPutAuxDTO.nome = this.usuario.nome;
    this.usuarioPutAuxDTO.apelido = this.usuario.apelido;
    this.usuarioPutAuxDTO.dtNasc = this.usuario.dtNasc;
    this.usuarioPutAuxDTO.email = this.usuario.email;
    this.usuarioPutAuxDTO.telefone1 = this.usuario.telefone1;
    this.usuarioPutAuxDTO.telefone2 = this.usuario.telefone2;
    this.usuarioPutAuxDTO.telefone3 = this.usuario.telefone3;
  }

  mostraralertConfirmarAlterar() {
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Deseja salvar as alterações realizadas no usuário?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            this.usuarioPutDTO = this.usuarioPutAuxDTO;
            this.preencherUsuarioForm();
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.alterarUsuario();
          }
        }
      ]
    });
    alert.present();
  }

  alterarUsuario() {
    this.abreCarregando();
    this.usuarioService.putUsuario(this.usuarioLogado.id, this.usuarioPutDTO)
      .subscribe(resposta => {
        this.fechaCarregando();
        this.mostrarToastCorfirmacaoAlteracao();
        this.obterUsuario();
      },
        error => {
          this.fechaCarregando();
          this.tratarErro(error);
          this.usuarioPutDTO = this.usuarioPutAuxDTO;
          this.preencherUsuarioForm();
        }
      );
  }

  tratarErro(error) {
    let errorObj = error;
    if (errorObj.error) {
      errorObj = errorObj.error;
      if (errorObj.status === 422) {
        this.alertErroValidacao(errorObj);
      }
    }
  }

  alertErroValidacao(errorObj) {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      message: this.listErrors(errorObj.errors),
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  private listErrors(messages : FieldMessage[]) : string {
    let s : string = '';
    for (let i = 0; i < messages.length; i++) {
        s = s + '<p>' + messages[i].message + '</p>';
    }
    return s;
  }


  mostrarToastCorfirmacaoAlteracao() {
    let toast = this.toastCtrl.create({
      message: 'Alteração salva com sucesso!',
      duration: 3000
    });
    toast.present();
  }
  
  // foto

  // ------------ teste firibase -------------------

  takePhoto() {
    this.camera.getPicture({ 
      sourceType: this.camera.PictureSourceType.CAMERA,
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  

  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  private uploadPhoto(): void {
    this.myPhotosRef.child(this.getCaminhoPastaImage()).child(this.usuarioLogado.id + '.jpg')
      .putString(this.myPhoto, 'base64', { contentType: 'image/jpg' })
      .then((savedPicture) => {
        this.foto = savedPicture.downloadURL;
      });
  }

  getCaminhoPastaImage(): string {
    return '/usuarios/' + this.usuarioLogado.id;
  }
  
  deletePhoto() {
    let caminhoPastaImage = firebase.storage().ref(this.getCaminhoPastaImage());
    let desertRef = caminhoPastaImage.child(this.usuarioLogado.id + '.jpg');
    desertRef.delete().then(function() {
      this.foto = 'assets/imgs/avatar-default/avatar-default.png';
    }).catch(function(error) {
      // Uh-oh, an error occurred!
    });
  }



  // ------------ fim teste firibase -------------------

  escolherModoAlterarFoto() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opções',
      buttons: [
        {
          icon: 'ios-folder',
          text: 'Escolher foto no dispositivo',
          handler: () => {
            this.selectPhoto();
          }
        }, {
          icon: 'ios-camera',
          text: 'Foto via câmera',
          handler: () => {
            this.takePhoto();
          }
        }, {
          icon: 'ios-trash',
          text: 'Remover foto',
          handler: () => {
            this.deletePhoto();
          }
        }, {
          icon: 'ios-close',
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.cancelarAlterarFoto();
          }
        }
      ]
    });
    actionSheet.present();
  }

  obterFotoGaleria() {
  }

  obterFotoCamera() {
  }

  removerFoto() {
    this.foto = null;
    this.usuarioLogado.urlFoto = 'avatar-default';
    // mudar para foto default e salvar no BD e excluir no bucket
  }

  cancelarAlterarFoto() {
  }

  blobToDataURL(blob) {
    return new Promise((fulfill, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => fulfill(reader.result);
      reader.readAsDataURL(blob);
    })
  }

  // senha
  abrirModalAlterarSenha() {
    let modal = this.modalCtrl.create(SenhaModal, { 'usuarioId': this.usuarioLogado.id });
    modal.present();
  }

  // endereço
  abrirModalAlterarEndereco(enderecoModal: EnderecoDTO) {
    let modal = this.modalCtrl.create(EnderecoModal, { 
      'endereco': enderecoModal,
      'titulo':'Alterar endereço',
     });
    modal.onDidDismiss(resposta => {
      if (resposta !== 'cancelar') {
        this.toastCtrl.create({
          message: resposta,
          duration: 3000,
        }).present();
        this.obterUsuario();
      }
    });

    modal.present();
  }

  abrirModalNovoEndereco() {
    let enderecoModal: EnderecoDTO = new EnderecoDTO();
    enderecoModal.id = '0';
    let modal = this.modalCtrl.create(EnderecoModal, { 
      'endereco': enderecoModal,
      'usuario': this.usuario,
      'titulo':'Novo endereço',
     });
    modal.onDidDismiss(resposta => {
      if (resposta !== 'cancelar') {
        this.toastCtrl.create({
          message: resposta,
          duration: 3000,
        }).present();
        this.obterUsuario();
      }
    });

    modal.present();
  }

  confirmaDeletarEndereco(enderecoId: string) {
    this.mostrarAlertConfirmarDeletarEndereco(enderecoId);
  }

  mostrarAlertConfirmarDeletarEndereco(enderecoId: string) {
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Deseja exlcuir este endereço?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            // nada
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.deletarEndereco(enderecoId);
          }
        }
      ]
    });
    alert.present();
  }

  deletarEndereco(enderecoId: string) {
    this.abreCarregando();
    this.enderecoService.deleteEndereco(enderecoId)
      .subscribe(resposta => {
        this.fechaCarregando();
        this.obterUsuario();
        this.mostrarToastCorfirmacaoAlteracao();
      }, error => {
        this.fechaCarregando();
        console.log(error);
      }
      );
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


  swipe(event) {
    if (event.direction === 2) {
      if(this.segmentUsuario === 'segmentAbaDadosBasicos') {
        this.segmentUsuario = 'segmentAbaEndereco';
      } else
      if (this.segmentUsuario === 'segmentAbaEndereco') {
        this.segmentUsuario = 'segmentAbaDadosAcesso';
      }
    } 
    if(event.direction === 4) {
      if(this.segmentUsuario === 'segmentAbaDadosAcesso') {
        this.segmentUsuario = 'segmentAbaEndereco';
      } else
      if(this.segmentUsuario === 'segmentAbaEndereco') {
        this.segmentUsuario = 'segmentAbaDadosBasicos';
      } 
    }
  }


  validacaoDeCampos(campo: string): boolean {
    let i: number;
    let campoValue = this.usuarioForm.value[campo];

    if (campo === 'nome') {
      i = 0;
      if (this.usuarioForm.get(campo).hasError('required') && this.usuarioForm.get(campo).touched) {
        this.mensagemErro[i] = 'Nome obrigatório';
        return false;
      } else if (this.usuarioForm.get(campo).hasError('minlength')) {
        this.mensagemErro[i] = 'Mínimo 3 caracters ';
        return false;
      } else if (this.usuarioForm.get(campo).touched && campoValue.trim().length === 0) {
        this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
      } else {
        return true;
      }
    } else if (campo === 'apelido') {
      i = 1
      if (this.usuarioForm.get(campo).hasError('required') && this.usuarioForm.get(campo).touched) {
        this.mensagemErro[i] = 'Login obrigatório';
        return false;
      } else if (this.usuarioForm.get(campo).touched && campoValue.trim().length === 0) {
        this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
      } else {
        return true;
      }
    } else if (campo === 'email') {
      i = 2;
      if (this.usuarioForm.get(campo).hasError('required') && this.usuarioForm.get(campo).touched) {
        this.mensagemErro[i] = 'Email é obrigatório';
        return false;
      } else if (this.usuarioForm.get(campo).hasError('pattern') && this.usuarioForm.get(campo).touched) {
        this.mensagemErro[i] = 'Email inválido';
        return false;
      } else if (this.usuarioForm.get(campo).touched && campoValue.trim().length === 0) {
        this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
      } else {
        return true;
      }
    } else if (campo === 'dtNasc') {
      i = 3;
      if (this.usuarioForm.get(campo).hasError('required') && this.usuarioForm.get(campo).touched) {
        this.mensagemErro[i] = 'Data nascimento é obrigatória';
        return false;
      } else {
        return true;
      }
    } else if (campo === 'telefone1') {
      i = 4;
      if (this.usuarioForm.get(campo).hasError('required') && this.usuarioForm.get(campo).touched) {
        this.mensagemErro[i] = 'Telefone obrigatório';
        return false;
      } else if (this.usuarioForm.get(campo).hasError('minlength')) {
        this.mensagemErro[i] = 'Mínimo 3 caracters ';
        return false;
      } else if (this.usuarioForm.get(campo).touched && campoValue.trim().length === 0) {
        this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
      } else {
        return true;
      }
    } else if (campo === 'telefone2') {
      i = 5;
      if(this.usuarioForm.get(campo).dirty) {
        if (this.usuarioForm.get(campo).hasError('minlength')) {
          this.mensagemErro[i] = 'Mínimo 3 caracters ';
          return false;
        } else if (this.usuarioForm.get(campo).touched && campoValue.trim().length === 0) {
          this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
        } else {
          return true;
        }
      }
    } else if (campo === 'telefone3') {
      i = 6;
      if(this.usuarioForm.get(campo).dirty){
        if (this.usuarioForm.get(campo).hasError('minlength')) {
          this.mensagemErro[i] = 'Mínimo 3 caracters ';
          return false;
        } else if (this.usuarioForm.get(campo).touched && campoValue.trim().length === 0) {
          this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
        } else {
          return true;
        }
      }
    }
  }


}
