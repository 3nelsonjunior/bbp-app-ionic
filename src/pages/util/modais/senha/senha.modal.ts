import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, AlertController, ToastController, LoadingController } from 'ionic-angular';

import { SenhaDTO } from '../../../../dev/models/senha.dto.';
import { FieldMessage } from '../../../../dev/models/filed-message.dto';

import { UsuarioService } from '../../../../dev/services/model/usuario.service';
import { LocalStorageUsuarioService } from '../../../../dev/services/local-storage/local-storage-usuario.service';
import { LocalStorageTokenService } from '../../../../dev/services/local-storage/local-storage-token.service';



@Component({
    selector: 'modal-senha',
    templateUrl: 'senha.modal.html',
})
export class SenhaModal {
   
    public usuarioId: string;
    public senhaDTO: SenhaDTO = new SenhaDTO();
    public confirmaSenha: SenhaDTO = new SenhaDTO();
    public erro = null;
    public carregar;

    constructor(
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public loadingController: LoadingController,
        public usuarioService: UsuarioService,
        public lsUsuarioService: LocalStorageUsuarioService,
        public lsTokenService: LocalStorageTokenService,
    ) {
        this.usuarioId = this.navParams.get('usuarioId');
    }

    habilitarSalvar(): boolean {
        if (this.senhaDTO.senha === null || this.senhaDTO.senha === undefined) {
            return false;
        } else if (this.senhaDTO.senha.trim().length < 6) {
            return false;
        } else if (this.confirmaSenha.senha === null || this.confirmaSenha.senha === undefined) {
            return false;
        } else if (this.confirmaSenha.senha.trim().length < 6) {
            return false;
        } else if (this.senhaDTO.senha !== this.confirmaSenha.senha) {
            return false;
        } else {
            return true;
        }
    }

    senhaValida() {
        if(this.isNullOuUndefined(this.senhaDTO.senha) && this.isNullOuUndefined(this.confirmaSenha.senha )) {
            return ((this.senhaDTO.senha === this.confirmaSenha.senha) || (this.senhaDTO.senha.trim().length === 0 && this.confirmaSenha.senha.trim().length === 0));
        } else {
            return true;
        }
    }

    isNullOuUndefined(valor) {
        return valor !== null && valor !== undefined;
    }

    salvarSenha() {
        this.abreCarregando();
        this.usuarioService.putSenha(this.usuarioId, this.senhaDTO)
            .subscribe(resposta => {
                this.fechaCarregando();
                this.mostrarToastCorfirmacaoAlteracao();
            }, error => {
                this.fechaCarregando();
                this.mostrarAlertErro(error['error']);
            }
            );
    }

    mostrarAlertSalvarAlteracao() {
        let alert = this.alertCtrl.create({
            title: 'Salvar',
            message: 'Deseja realemente alterar a senha usuário?',
            buttons: [
                {
                    text: 'Não',
                    handler: () => {
                        this.cancelarAlterar();
                    }
                },
                {
                    text: 'Sim',
                    handler: () => {
                        if (this.validarSenha()) {
                            this.salvarSenha();
                        } else {
                            this.mostrarAlertErroValidacao();
                        }
                    }
                }
            ]
        });
        alert.present();
    }

    cancelarAlterar() {
        // nada
    }

    validarSenha() {
        this.erro = null;
        if (this.senhaDTO.senha !== this.confirmaSenha.senha) {
            this.erro = 'Senhas não conferem!';
            return false;
        } else {
            return true;
        }
    }

    mostrarAlertErroValidacao() {
        let alert = this.alertCtrl.create({
            title: 'Erro',
            subTitle: this.erro,
            buttons: ['OK']
        });
        alert.present();
    }


    fecharModal() {
        this.viewCtrl.dismiss();
    }

    mostrarToastCorfirmacaoAlteracao() {
        this.fecharModal();
        let toast = this.toastCtrl.create({
            message: 'Senha alterada com sucesso!',
            duration: 3000
        });
        toast.present();
    }

    mostrarAlertErro(erro) {
        let alert = this.alertCtrl.create({
            title: erro.msg,
            message: this.listarErros(erro.errors),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    private listarErros(messages: FieldMessage[]): string {
        let s: string = '';
        for (var i = 0; i < messages.length; i++) {
            if (i > 0) {
                s = s + messages[i].message + '</p>';
            } else {
                s = messages[i].message + '</p>';
            }

        }
        return s;
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