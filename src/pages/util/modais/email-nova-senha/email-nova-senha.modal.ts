import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../dev/services/model/usuario.service';

@Component({
  selector: 'modal-email-nova-senha',
  templateUrl: 'email-nova-senha.modal.html',
})
export class EmailNovaSenhaModal {

  public emailForm: FormGroup;
  public mensagemErro: string;
  public carregar;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public viewCtrl : ViewController,
    public usuarioService: UsuarioService,
  ) {
    this.inicializarEmailForm();
  }

    inicializarEmailForm() {
        this.emailForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
        });
    }

    recuperarSenha() {
        this.abreCarregando();
        this.usuarioService.postGerarNovaSenha(this.emailForm.value['email']).subscribe(
            resposta => {
                console.log(resposta);
                this.fechaCarregando();
                this.viewCtrl.dismiss('Nova senha gerado com sucesso e enviada para email informado!');
            }, error => {
                console.log(error);
                this.fechaCarregando();
                this.viewCtrl.dismiss('Ocorreu um erro ao tentar recuperar senha!');
            }
        );
    }

    mostrarAlertDuvida() {
        let alert = this.alertCtrl.create({
            title: 'Dúvida?',
            message: 'Será gerada uma nova senha aleatória e enviada para seu email cadastrado na base, caso sua conta tenha sido criada via Facebook ou Google, utilize o endereço de email referente!',
            buttons: [
                {
                    text: 'Ok',
                }
            ]
        });
        alert.present();
    }

  mostrarAlertConfirmarRecuperarSenha() {
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Deseja gerar nova senha e recebêla por email?',
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
            this.recuperarSenha();
          }
        }
      ]
    });
    alert.present();
  }

  fecharModal(){
    this.viewCtrl.dismiss('cancelar');
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

    validacaoCampo(): boolean {
        let i: number;
        let campo: string = 'email';
        let campoValue = this.emailForm.value[campo];

        i = 4;
        if (this.emailForm.get(campo).hasError('required') && this.emailForm.get(campo).touched) {
            this.mensagemErro = 'Email é obrigatório';
            return false;
        } else if (this.emailForm.get(campo).hasError('pattern') && this.emailForm.get(campo).dirty) {
            this.mensagemErro = 'Email inválido';
            return false;
        } else if (this.emailForm.get(campo).dirty && campoValue.trim().length === 0) {
            this.mensagemErro = 'Campo preenchido apenas com espaçamento';
        } else {
            return true;
        }
    }


}
