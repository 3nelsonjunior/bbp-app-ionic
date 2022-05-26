import { DiaBarbeariaDTO } from './../../dev/models/dia-barbearia.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

import { UsuarioLogadoDTO } from '../../dev/models/usuario-logado.dto';
import { LocalStorageUsuarioService } from '../../dev/services/local-storage/local-storage-usuario.service';
import { DateUtilService } from '../../dev/services/util/date-util.service';
import { DiaModal } from '../util/modais/dia/dia.modal';


@IonicPage()
@Component({
  selector: 'page-barbearia-controle-dia',
  templateUrl: 'barbearia-controle-dia.html',
})
export class BarbeariaControleDiaPage {

  public usuarioLogado: UsuarioLogadoDTO = new UsuarioLogadoDTO();
  public listaDias: DiaBarbeariaDTO[] = [];
  public listaDiasExibidos: DiaBarbeariaDTO[] = [];
  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public lsUsuarioService: LocalStorageUsuarioService,
    public dateUtilService: DateUtilService,
  ) {
    this.usuarioLogado = lsUsuarioService.getLocalStorageUsuario().usuarioLogado;
    this.criarDiasMock();
  }

  abrirModalNovoDia() {
    let diaModal: DiaBarbeariaDTO = new DiaBarbeariaDTO();
    diaModal = this.dateUtilService.inicializarDia(diaModal, this.usuarioLogado);
    let modal = this.modalCtrl.create(DiaModal, {
      'dia': diaModal,
      'titulo':'Abrir novo dia',
     });
    modal.onDidDismiss(resposta => {
      if (resposta !== 'cancelar') {
        this.toastCtrl.create({
          message: resposta,
          duration: 3000,
        }).present();
        //this.obteDias();
      }
    });

    modal.present();
  }

  /* inicializarDia(diaNovoModal: DiaBarbeariaDTO): DiaBarbeariaDTO {
    diaNovoModal.id = null;
    diaNovoModal.data = this.dateUtilService.dateToNumber(new Date());
    diaNovoModal.isAberto = true;
    diaNovoModal.isLiberadoCliente = false;
    diaNovoModal.usuarioAbrirDia = this.usuarioLogado;
    diaNovoModal.usuarioFecharDia = null;
    diaNovoModal.horaInicioDia = null;
    diaNovoModal.horaFecharDia = null;
    diaNovoModal.listaHorario = [];

    diaNovoModal.dataExibicao = this.dateUtilService.NumberDateToFormatStringDateBR(diaNovoModal.data);
    diaNovoModal.diaDaSemana = this.dateUtilService.getDiaSemana(diaNovoModal.data);
    diaNovoModal.diaExibicao = this.dateUtilService.getStringDia(diaNovoModal.data);
    return diaNovoModal;
  } */
  
  criarDiasMock() {
    let inicio: number = 20180729;
    let diaNumber: number = inicio;
    for(let i=0; i < 10; i++) {
      let dia: DiaBarbeariaDTO = new DiaBarbeariaDTO();
      dia.id = String(i+1);
      dia.dataExibicao = this.dateUtilService.NumberDateToFormatStringDateBR(diaNumber);
      dia.diaDaSemana = this.dateUtilService.getDiaSemana(diaNumber);
      dia.diaExibicao = this.dateUtilService.getStringDia(diaNumber);
      dia.isAberto = true;
      if(i == 0) {
        dia.isLiberadoCliente = false;
      } else {
        dia.isLiberadoCliente = true;
      }
      this.listaDias.push(dia);
      diaNumber = this.dateUtilService.getProximoDia(diaNumber);
    }
    let isADM:boolean = false;
    this.usuarioLogado.perfis.forEach(item => {
        if(item.nome == 'ROLE_ADMIN') {
          isADM = true;
        }
      });

    this.listaDias.forEach(item => {
      if(!item.isLiberadoCliente && !isADM) {

      } else {
        this.listaDiasExibidos.push(item);
      }
    }); 
  }

  

}
