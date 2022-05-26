import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";

import { LocalStorageUsuarioService } from '../../../../dev/services/local-storage/local-storage-usuario.service';
import { UsuarioLogadoDTO } from '../../../../dev/models/usuario-logado.dto';
import { DiaBarbeariaDTO } from '../../../../dev/models/dia-barbearia.dto';
import { DateUtilService } from '../../../../dev/services/util/date-util.service';

import { isNullOrUndefined } from 'util';


@Component({
    selector: 'modal-dia',
    templateUrl: 'dia.modal.html',
})
export class DiaModal {
   
    public titulo: string;
    public usuarioLogado: UsuarioLogadoDTO = new UsuarioLogadoDTO();
    public diaBarbeariaDTO: DiaBarbeariaDTO = new DiaBarbeariaDTO();
    public listaHoras: string[] = [];
    public horaInicioDia: string;
    public horaFecharDia: string;

    constructor(
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public dateUtilService: DateUtilService,
        public lsUsuarioService: LocalStorageUsuarioService,
    ) {
        this.usuarioLogado = lsUsuarioService.getLocalStorageUsuario().usuarioLogado;
        this.titulo = this.navParams.get('titulo');
        this.diaBarbeariaDTO = this.navParams.get('dia');
        this.iniciarListaHoras();
    }

    iniciarListaHoras() {
        this.listaHoras = this.dateUtilService.preencherComboHorario(0,25);
    }

    selecionaAbrirDia(item: string) {
        debugger
        //this.diaBarbeariaDTO.horaInicioDia = Number(item.lastIndexOf(':'));
        this.diaBarbeariaDTO.horaInicioDia = Number(item.substring(0,2));
        console.log(this.diaBarbeariaDTO.horaInicioDia);
        if(!isNullOrUndefined(this.horaFecharDia)) {
            if((this.diaBarbeariaDTO.horaFecharDia < this.diaBarbeariaDTO.horaInicioDia) && (!isNullOrUndefined(this.horaFecharDia))) {
                this.mostrarAlertAvisoData();
                this.horaInicioDia = null;
                this.diaBarbeariaDTO.horaInicioDia = null;
            }
        }
    }

    selecionaFecharDia(item: string) {
        debugger
        this.diaBarbeariaDTO.horaFecharDia = Number(item.substring(0,2));
        console.log(this.diaBarbeariaDTO.horaFecharDia);
        if(!isNullOrUndefined(this.horaInicioDia)) {
            if((this.diaBarbeariaDTO.horaFecharDia < this.diaBarbeariaDTO.horaInicioDia) && (!isNullOrUndefined(this.horaInicioDia))) {
                this.mostrarAlertAvisoData();
                this.horaFecharDia = null;
                this.diaBarbeariaDTO.horaFecharDia = null;
            }
        }
    }


    openCalendar() {
        const options: CalendarModalOptions = {
            title: 'Escolha a data.:',
            color: 'dark',
            weekdays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            closeLabel: 'Cancelar',
            doneLabel: 'Confirma',
        };

        let myCalendar = this.modalCtrl.create(CalendarModal, {
            options: options
        });

        myCalendar.present();

        myCalendar.onDidDismiss((date: CalendarResult, type: string) => {

            if (!isNullOrUndefined(date)) {
                this.diaBarbeariaDTO.dataExibicao = this.dateUtilService.NumberDateToFormatStringDateBR(this.dateUtilService.dateToNumber(date.dateObj));
                this.limparCampos();
            }
        })
    }

    limparCampos() {
        this.horaInicioDia = null;
        this.horaFecharDia = null;
        this.diaBarbeariaDTO.horaInicioDia = null;
        this.diaBarbeariaDTO.horaFecharDia = null;
    }

    mostrarAlertAvisoData() {
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'O horário de fechamento não pode ser menor que o horário de abertura!',
          buttons: ['OK']
        });
        alert.present();
    }

    salvarDia() {

    }

    fecharModal() {
        this.viewCtrl.dismiss('cancelar');
    }
    

}