import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { EnderecoDTO } from '../../../../dev/models/endereco.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../dev/services/model/usuario.service';
import { LocalStorageUsuarioService } from '../../../../dev/services/local-storage/local-storage-usuario.service';
import { EnderecoService } from '../../../../dev/services/model/endereco.service';
import { UsuarioDTO } from '../../../../dev/models/usuario.dto';
import { AutenticacaoService } from '../../../../dev/services/autenticacao/autenticacao.service';
import { GenericUtilService } from '../../../../dev/services/util/generic-util.service';


@Component({
  selector: 'modal-endereco',
  templateUrl: 'endereco.modal.html',
})
export class EnderecoModal {

  public titulo: string;
  public enderecoForm: FormGroup;
  public enderecoDTO : EnderecoDTO;
  public usuario: UsuarioDTO = new UsuarioDTO();
  public usuarioId: string;
  public mensagemErro: string[] = [];
  public carregar;
  
  constructor(
      public navParams: NavParams,
      public viewCtrl : ViewController,
      public formBuilder: FormBuilder,
      public alertCtrl: AlertController,
      public loadingController: LoadingController,
      public enderecoService: EnderecoService,
      public genericUtilService: GenericUtilService,
      public usuarioService: UsuarioService,
      public lsUsuarioService: LocalStorageUsuarioService,
      
    ) {
    this.usuarioId = this.lsUsuarioService.getLocalStorageUsuario().usuarioLogado.id;
    this.titulo = this.navParams.get('titulo');
    this.enderecoDTO = this.navParams.get('endereco');
    this.usuario = this.navParams.get('usuario');
    this.enderecoDTO.pais = 'Brasil';
    this.inicializarEnderecoForm();
  }

  inicializarEnderecoForm() {
    this.enderecoForm = this.formBuilder.group({
      id: [this.enderecoDTO.id, [Validators.required]],
      logradouro: [this.enderecoDTO.logradouro, [Validators.required]],
      numero: [this.enderecoDTO.numero, [Validators.required]],
      complemento: [this.enderecoDTO.complemento,],
      bairro: [this.enderecoDTO.bairro, [Validators.required]],
      cidade: [this.enderecoDTO.cidade, [Validators.required]],
      estado: [this.enderecoDTO.estado, [Validators.required]],
      cep: [this.enderecoDTO.cep, [Validators.required]],
      pais: [this.enderecoDTO.pais, [Validators.required]],
      usuario: [this.enderecoDTO.usuario, [Validators.required]],
    });
  }

  obterEnderecoPeloCep() {
    let cep = this.enderecoForm.controls['cep'].value;
    if(cep === null || cep === undefined || cep === '') {
      this.mostrarAlertErroObterCEPNull();
    } else {
      this.abreCarregando();
      this.genericUtilService.getEnderecoPorCEP(cep).subscribe(
        resposta => {
          this.fechaCarregando();
          this.preencherEnderecoForm(resposta);
        }, error => {
          console.log(error);
          this.fechaCarregando();
          this.mostrarAlertErroObterCEP();
        }
      );
    }
  }

  salvarEndereco(){
    this.enderecoDTO = this.enderecoForm.value;
    if(this.enderecoDTO.id === '0') {
      this.enderecoDTO.id = null;
      this.criarNovoEnderecoUsuario();
    } else {
      this.alterarEnderecoUsuario();
    }
  }

  criarNovoEnderecoUsuario() {
    this.abreCarregando();
    this.enderecoDTO.usuario = this.usuario;
    this.enderecoService.postEndereco(this.enderecoDTO).subscribe(
      resposta => {
        console.log(resposta);
        this.fechaCarregando();
        this.viewCtrl.dismiss('Endereço cadastrado com sucesso!');
      }, error => {
        this.fechaCarregando();
        this.viewCtrl.dismiss('Ocorreu um erro ao tentar salvar novo endereço!');
      }
    );
  }

  alterarEnderecoUsuario() {
    this.abreCarregando();
    this.enderecoService.putEndereco(this.enderecoDTO.id, this.enderecoDTO).subscribe(
      resposta => {
        console.log(resposta);
        this.fechaCarregando();
        this.viewCtrl.dismiss('Endereço alterado com sucesso!');
      }, error => {
        console.log(error);
        this.fechaCarregando();
        this.viewCtrl.dismiss('Ocorreu um erro ao tentar salvar alteração!');
      }
    );
  }

  fecharModal(){
    this.viewCtrl.dismiss('cancelar');
  }

  preencherEnderecoForm(end) {
    let endereco = JSON.parse(end._body);
    let _id: string;
    if(this.enderecoDTO.id === null || this.enderecoDTO.id === undefined) {
      _id = '0'; // novo endereco(backend trata esse valor para null)
    } else {
      _id = this.enderecoDTO.id; // endereco editado
    }
    this.enderecoForm.patchValue({
      id: _id,
      logradouro: endereco.logradouro,
      numero: '',
      complemento: endereco.complemento,
      bairro: endereco.bairro,
      cidade: endereco.localidade,
      estado: endereco.uf,
      cep: endereco.cep,
      pais: 'Brasil',
      usuario: this.usuario,
    });
  }

  mostrarAlertErroObterCEP() {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: `O CEP[${this.enderecoForm.controls['cep'].value}] informado não foi encontrado!`,
      buttons: ['OK']
    });
    alert.present();
  }

  mostrarAlertErroObterCEPNull() {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: 'Por favor, insira um CEP válido para consulta',
      buttons: ['OK']
    });
    alert.present();
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

  validacaoDeCampos(campo: string): boolean {
    let i: number;
    let campoValue = this.enderecoForm.value[campo];

    if (campo === 'cep') {
      i = 0;
      if (this.enderecoForm.get(campo).hasError('required') && this.enderecoForm.get(campo).touched) {
        this.mensagemErro[i] = 'CEP obrigatório';
        return false;
      } else if (this.enderecoForm.get(campo).dirty && campoValue !== null) {
        if (campoValue.length !== 0 && campoValue.trim().length === 0) {
          this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }

    } else if (campo === 'logradouro') {
      i = 1
      if (this.enderecoForm.get(campo).hasError('required') && this.enderecoForm.get(campo).touched) {
        this.mensagemErro[i] = 'Logradouro obrigatório';
        return false;
      } else if (this.enderecoForm.get(campo).dirty && campoValue !== null) {
        if (campoValue.length !== 0 && campoValue.trim().length === 0) {
          this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }

    } else if (campo === 'numero') {
      i = 2;
      if (this.enderecoForm.get(campo).hasError('required') && this.enderecoForm.get(campo).touched) {
        this.mensagemErro[i] = 'Número obrigatório';
        return false;
      } else if (this.enderecoForm.get(campo).dirty && campoValue !== null) {
        if (campoValue.length !== 0 && campoValue.trim().length === 0) {
          this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else if (campo === 'bairro') {
      i = 4; // 3 - complemento
      if (this.enderecoForm.get(campo).hasError('required') && this.enderecoForm.get(campo).touched) {
        this.mensagemErro[i] = 'Bairro é obrigatória';
        return false;
      } else if (this.enderecoForm.get(campo).dirty && campoValue !== null) {
        if (campoValue.length !== 0 && campoValue.trim().length === 0) {
          this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else if (campo === 'cidade') {
      i = 5;
      if (this.enderecoForm.get(campo).hasError('required') && this.enderecoForm.get(campo).touched) {
        this.mensagemErro[i] = 'Cidade é obrigatório';
        return false;
      } else if (this.enderecoForm.get(campo).dirty && campoValue !== null) {
        if (campoValue.length !== 0 && campoValue.trim().length === 0) {
          this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else if (campo === 'estado') {
      i = 6;
      if (this.enderecoForm.get(campo).hasError('required') && this.enderecoForm.get(campo).touched) {
        this.mensagemErro[i] = 'Estado obrigatório';
        return false;
      } else if (this.enderecoForm.get(campo).dirty && campoValue !== null) {
        if (campoValue.length !== 0 && campoValue.trim().length === 0) {
          this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else if (campo === 'pais') {
      i = 7;
      if (this.enderecoForm.get(campo).hasError('required') && this.enderecoForm.get(campo).touched) {
        this.mensagemErro[i] = 'País obrigatório';
        return false;
      } else if (this.enderecoForm.get(campo).dirty && campoValue !== null) {
        if (campoValue.length !== 0 && campoValue.trim().length === 0) {
          this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }

}