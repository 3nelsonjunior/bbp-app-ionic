import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, AlertController, MenuController, LoadingController } from 'ionic-angular';
import { UsuarioService } from '../../dev/services/model/usuario.service';
import { LocalStorageUsuarioService } from '../../dev/services/local-storage/local-storage-usuario.service';
import { LocalStorageTokenService } from '../../dev/services/local-storage/local-storage-token.service';
import { UsuarioPostDTO } from '../../dev/models/usuario-post.dto';
import { FieldMessage } from '../../dev/models/filed-message.dto';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'usuario-cadastro',
  templateUrl: 'usuario-cadastro.html'
})
export class UsuarioCadastroPage {

    public cadastroUsuarioForm: FormGroup;
    public usuarioPostDTO: UsuarioPostDTO = new UsuarioPostDTO();
    public mensagemErro: string[] = [];
    public carregar;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public menuController: MenuController,
        public loadingController: LoadingController,
        public formBuilder: FormBuilder,
        public usuarioService: UsuarioService,
        public lsUsuarioService: LocalStorageUsuarioService,
        public lsTokenService: LocalStorageTokenService,
    ) {
        this.usuarioPostDTO = this.navParams.data['usuarioPostDTO'];
        this.inicializarCadastroUsuarioForm();
    }

    ionViewWillEnter() { // quando for entrar na página
        this.menuController.swipeEnable(false);
    }

    ionViewDidLeave() {  // quando já tiver saído da página
        this.menuController.swipeEnable(true);
    }

    inicializarCadastroUsuarioForm() {
        this.cadastroUsuarioForm = this.formBuilder.group({
            nome: [this.usuarioPostDTO.nome, [Validators.required , Validators.minLength(3)]],
            apelido: [this.usuarioPostDTO.apelido, [Validators.required, Validators.minLength(3)]],
            senha: [this.usuarioPostDTO.senha, [Validators.required , Validators.minLength(6)]],
            dtNasc: [this.usuarioPostDTO.dtNasc, [Validators.required]],
            email: [this.usuarioPostDTO.email, [Validators.required,  Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
            telefone1: [this.usuarioPostDTO.telefone1, [Validators.required , Validators.minLength(3)]],
        });
    }

    confirmarCriarUsuario() {
        this.preencherUsuarioPostDTO();
        this.mostraralertConfirmarCadastrar();
    }

    preencherUsuarioPostDTO() {
        this.usuarioPostDTO.id = null;
        this.usuarioPostDTO.nome = this.cadastroUsuarioForm.value['nome'];
        this.usuarioPostDTO.apelido = this.cadastroUsuarioForm.value['apelido'];
        this.usuarioPostDTO.senha = this.cadastroUsuarioForm.value['senha'];
        this.usuarioPostDTO.dtNasc = this.cadastroUsuarioForm.value['dtNasc'];
        this.usuarioPostDTO.email = this.cadastroUsuarioForm.value['email'];
        this.usuarioPostDTO.telefone1 = this.cadastroUsuarioForm.value['telefone1'];
    }

    mostraralertConfirmarCadastrar() {
        let alert = this.alertCtrl.create({
            title: 'Confirmar',
            message: 'Deseja cadastrar um novo usuário?',
            buttons: [
                {
                    text: 'Não',
                    handler: () => {
                        //
                    }
                },
                {
                    text: 'Sim',
                    handler: () => {
                        this.criarUsuario();
                    }
                }
            ]
        });
        alert.present();
    }

    criarUsuario() {
        this.abreCarregando();
        this.usuarioService.postUsuario(this.usuarioPostDTO)
            .subscribe(resposta => {
                this.fechaCarregando();
                this.logar();
            },
                error => {
                    this.fechaCarregando();
                    console.log(error.status);
                    this.mostrarAlertErroCadastro(error);
                }
            );
    }

    logar() {
        let alert = this.alertCtrl.create({
            title: 'Sucesso!',
            message: 'Cadastro efetuado com sucesso',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        this.voltar();
                    }
                }
            ]
        });
        alert.present();
    }

    mostrarAlertErroCadastro(erro) {
        let alert = this.alertCtrl.create({
            title: 'Erro',
            message: this.listaErros(erro.errors),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok',
                }
            ]
        });
        alert.present();
    }

    listaErros(messages: FieldMessage[]): string {
        let s: string = '';
        for (var i = 0; i < messages.length; i++) {
            s = s + '<p><strong>' + messages[i].fieldName + "</strong>: " + messages[i].message + '</p>';
        }
        return s;
    }

    voltar() {
        this.navCtrl.pop();
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [year, month, day].join('-');
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
        let campoValue = this.cadastroUsuarioForm.value[campo];

        if (campo === 'nome') {
            i = 0;
            if (this.cadastroUsuarioForm.get(campo).hasError('required') && this.cadastroUsuarioForm.get(campo).touched) {
                this.mensagemErro[i] = 'Nome obrigatório';
                return false;
            } else if (this.cadastroUsuarioForm.get(campo).hasError('minlength')) {
                this.mensagemErro[i] = 'Mínimo 3 caracters ';
                return false;
            } else if (this.cadastroUsuarioForm.get(campo).touched && campoValue.trim().length === 0) {
                this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
            } else {
                return true;
            }
        } else if(campo === 'apelido') {
            i = 1
            if(this.cadastroUsuarioForm.get(campo).hasError('required') && this.cadastroUsuarioForm.get(campo).touched) {
                this.mensagemErro[i] = 'Login obrigatório';
                return false;
            } else if (this.cadastroUsuarioForm.get(campo).touched && campoValue.trim().length === 0) {
                this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
            } else {
                return true;
            }
        } else if(campo === 'senha') {
            i = 2;
            if(this.cadastroUsuarioForm.get(campo).hasError('required') && this.cadastroUsuarioForm.get(campo).touched) {
                this.mensagemErro[i] = 'Nome obrigatório';
                return false;
            } else if(this.cadastroUsuarioForm.get(campo).hasError('minlength')) {
                this.mensagemErro[i] = 'Mínimo 6 caracters ';
                return false;
            } else if (this.cadastroUsuarioForm.get(campo).touched && campoValue.trim().length === 0) {
                this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
            } else {
                return true;
            }
        } else if(campo === 'dtNasc') {
            i = 3;
            if(this.cadastroUsuarioForm.get(campo).hasError('required') && this.cadastroUsuarioForm.get(campo).touched) {
                this.mensagemErro[i] = 'Data nascimento é obrigatória';
                return false;
            } else {
                return true;
            }
        } else if(campo === 'email') {
            i = 4;
            if(this.cadastroUsuarioForm.get(campo).hasError('required') && this.cadastroUsuarioForm.get(campo).touched) {
                this.mensagemErro[i] = 'Email é obrigatório';
                return false;
            } else if(this.cadastroUsuarioForm.get(campo).hasError('pattern') && this.cadastroUsuarioForm.get(campo).touched) {
                this.mensagemErro[i] = 'Email inválido';
                return false;
            } else if (this.cadastroUsuarioForm.get(campo).touched && campoValue.trim().length === 0) {
                this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
            } else {
                return true;
            }
        } else if(campo === 'telefone1') {
            i = 5;
            if(this.cadastroUsuarioForm.get(campo).hasError('required') && this.cadastroUsuarioForm.get(campo).touched) {
                this.mensagemErro[i] = 'Telefone obrigatório';
                return false;
            } else if (this.cadastroUsuarioForm.get(campo).touched && campoValue.trim().length === 0) {
                this.mensagemErro[i] = 'Campo preenchido apenas com espaçamento';
            } else {
                return true;
            }
        }
    }


}