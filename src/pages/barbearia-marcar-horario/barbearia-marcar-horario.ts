import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GuardiaoService } from '../../dev/services/autenticacao/guardiao.service';
import { LocalStorageTokenService } from '../../dev/services/local-storage/local-storage-token.service';
import { LocalStorageUsuarioService } from '../../dev/services/local-storage/local-storage-usuario.service';

import { DataCustomizadaDTO } from '../../dev/models/data-customizada';
import { DiaDTO } from '../../dev/models/dia.dto';
import { HorarioDTO } from '../../dev/models/horario.dto';
import { TipoCorteDTO } from '../../dev/models/tipo-corte.dto';
import { TipoDiaDTO } from '../../dev/models/tipo-dia.dto';
import { UsuarioLogadoDTO } from '../../dev/models/usuario-logado.dto';
import { DateUtilService } from '../../dev/services/util/date-util.service';


@IonicPage()
@Component({
  selector: 'page-barbearia-marcar-horario',
  templateUrl: 'barbearia-marcar-horario.html',
})
export class BarbeariaMarcarHorarioPage {


  public segmentBarbearia: string = 'segmentAbaHorarios';
  public usuarioLogado: UsuarioLogadoDTO = new UsuarioLogadoDTO();
  public diaSelecionado: DiaDTO = new DiaDTO();
  public horarioAtual: HorarioDTO = new HorarioDTO();
  public listaDias: DiaDTO[] = [];
  public listaHorariosTotal: HorarioDTO[] = [];
  public listaHorariosExibidos: HorarioDTO[] = [];
  public listaTipoCortes: TipoCorteDTO[] = [];
  public listaTipoDias: TipoDiaDTO[] = [];
  public dataCustomizadaDTO: DataCustomizadaDTO = new DataCustomizadaDTO();
  public contHorario: number = 0;
  public contHorarioPreenchido: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public lsUsuarioService: LocalStorageUsuarioService,
    public lsTokenService: LocalStorageTokenService,
    public guardiaoService: GuardiaoService,
    public dateUtilService: DateUtilService,
  ) {
    this.usuarioLogado = lsUsuarioService.getLocalStorageUsuario().usuarioLogado;
    
  }

  ionViewCanEnter() {
    if(this.guardiaoService.existeUsuarioLogado()) {
      return true;
    } else {
      return false;
    }    
  }
  
  ionViewDidLoad() {
    this.iniciarMock();
    //this.testesComDatas();
  }

  testesComDatas() {
    let dataAtual: Date = new Date();
    console.log(dataAtual);
    let dataNumber: number = this.dateUtilService.dateToNumber(dataAtual);
    console.log(dataNumber);
    let dataDate: Date = this.dateUtilService.NumberToDate(dataNumber); 
    console.log(dataDate);
    let dataString: string = this.dateUtilService.NumberDateToFormatStringDateBR(dataNumber); 
    console.log(dataString);
    let listaHorarios: string[] = this.dateUtilService.criarListaHorarios(9,17);
    console.log(listaHorarios);
  }

  

  iniciarMock() {
    this.inicializarMockTipoCorte();
    this.inicializarMockTipoDia();
    this.inicializarMockDia();
    this.inicializarMockListaHorario();
    this.diaSelecionado = this.listaDias[0];
    this.selecionarDia(this.listaDias[0]);
  }

  // mock dados
  inicializarMockListaHorario() {
    this.listaDias.forEach(item => {
      this.preencherListaHorarioTotal(item);
    });
  }

  preencherListaHorarioTotal(dia: DiaDTO) {
    let totalHorariosPorDia: number = this.contHorario + 10;
    for(let i=this.contHorario; i < totalHorariosPorDia; i++) {
      let horario: HorarioDTO = new HorarioDTO();
      horario.id = String(i);
      horario.dia = dia;
      this.listaHorariosTotal.push(horario);
      this.contHorario++;
    }
  }

  selecionarDia(dia: DiaDTO) {
    let i: number = 0;
    this.listaHorariosTotal.forEach(item => {
      if(item.dia.id === dia.id) {
        this.listaHorariosExibidos[i] = item;
        i++;
      }
    });
  }

  verificaDiaAtual(id: string) {
  }


  inicializarMockDia() {
    let dia_1: DiaDTO = new DiaDTO(); // hoje
    let dia_2: DiaDTO = new DiaDTO(); // amanhã
    let dia_3: DiaDTO = new DiaDTO(); // depois de amanhã
    
    let auxData: Date;
    let dataString: string

    dataString = this.obterDia('hoje')
    auxData = new Date(dataString);
    dia_1.id = '0';
    dia_1.data = new Date(auxData);
    dia_1.tipoDia = this.listaTipoDias[0];
    dia_1.usuarioAbrirDia = this.usuarioLogado;
    dia_1.usuarioFecharDia = null;
    dia_1.isAberto = true;
    dia_1.dataCustomizadaDTO = this.customizarData(dia_1);
    dia_1.isDiaAtual = true;

    dataString = this.obterDia('amanha')
    auxData = new Date(dataString);
    dia_2.id = '1'; 
    dia_2.data = new Date(auxData); 
    dia_2.tipoDia = this.listaTipoDias[1];
    dia_2.usuarioAbrirDia = this.usuarioLogado;
    dia_2.usuarioFecharDia = null;
    dia_2.isAberto = true;
    dia_2.dataCustomizadaDTO = this.customizarData(dia_2);
    dia_2.isDiaAtual = false;

    dataString = this.obterDia('depois-amanha')
    auxData = new Date(dataString);
    dia_3.id = '2'; 
    dia_3.data = new Date(auxData); 
    dia_3.tipoDia = this.listaTipoDias[2];
    dia_3.usuarioAbrirDia = this.usuarioLogado;
    dia_3.usuarioFecharDia = null;
    dia_3.isAberto = false;
    dia_3.dataCustomizadaDTO = this.customizarData(dia_3);
    dia_3.isDiaAtual = false;

    this.listaDias.push(dia_1);
    this.listaDias.push(dia_2);
    this.listaDias.push(dia_3);

  }

  obterDia(tipoDiaOntemOuHojeOuAmanha: string) : string {
    let currentDate: Date;
    let dia: number;
    let mes: number;
    let ano: number;
    
    if(tipoDiaOntemOuHojeOuAmanha == 'hoje') {
      currentDate = new Date(new Date().getTime());
      dia = currentDate.getDate();
      mes = (currentDate.getMonth() + 1);
      ano = currentDate.getFullYear();
    } else  if(tipoDiaOntemOuHojeOuAmanha == 'amanha') {
      currentDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
      dia = currentDate.getDate();
      mes = (currentDate.getMonth() + 1);
      ano = currentDate.getFullYear();
    } else  if(tipoDiaOntemOuHojeOuAmanha == 'depois-amanha') {
      currentDate = new Date(new Date().getTime() + (24 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000));
      dia = currentDate.getDate();
      mes = (currentDate.getMonth() + 1);
      ano = currentDate.getFullYear();
    }

    let dataTexto :string = String(String(ano) + '/' + String(this.setDateZero(mes)) + '/' + String(this.setDateZero(dia)));
    return dataTexto;
  }

  customizarData(dia: DiaDTO): DataCustomizadaDTO {
    let dataCustomizada: DataCustomizadaDTO = new DataCustomizadaDTO();
    dataCustomizada.dia = ('0' + dia.data.getDate().toString()).slice(-2);
    dataCustomizada.mes = ('0' + (dia.data.getMonth() + 1).toString()).slice(-2);
    dataCustomizada.ano = dia.data.getFullYear().toString();
    return dataCustomizada;
  }

  setDateZero(date){
    return date < 10 ? '0' + date : date;
  }

  inicializarMockTipoDia() {
    let tipoDia_1: TipoDiaDTO = new TipoDiaDTO();
    let tipoDia_2: TipoDiaDTO = new TipoDiaDTO();
    let tipoDia_3: TipoDiaDTO = new TipoDiaDTO();

    tipoDia_1.id = '0';
    tipoDia_1.nome = 'Completo';
    tipoDia_1.horaInicioDia = 9;
    tipoDia_1.horaInicioDia = 16;

    tipoDia_2.id = '1';
    tipoDia_2.nome = 'Seg. a Sex.';
    tipoDia_2.horaInicioDia = 9;
    tipoDia_2.horaInicioDia = 16;

    tipoDia_3.id = '2';
    tipoDia_3.nome = 'Customizar';
    tipoDia_3.horaInicioDia = 9;
    tipoDia_3.horaInicioDia = 12;

    this.listaTipoDias.push(tipoDia_1);
    this.listaTipoDias.push(tipoDia_2);
    this.listaTipoDias.push(tipoDia_3);
  }

  inicializarMockTipoCorte() {
    let tipoCorteDTO_1: TipoCorteDTO = new TipoCorteDTO();
    let tipoCorteDTO_2: TipoCorteDTO = new TipoCorteDTO();
    let tipoCorteDTO_3: TipoCorteDTO = new TipoCorteDTO();
    let tipoCorteDTO_4: TipoCorteDTO = new TipoCorteDTO();
    let tipoCorteDTO_5: TipoCorteDTO = new TipoCorteDTO();

    tipoCorteDTO_1.id = '0';
    tipoCorteDTO_1.nome = 'Máquina 1 ou 1/2 ou Careca';
    tipoCorteDTO_1.valor = 8.00;

    tipoCorteDTO_2.id = '1';
    tipoCorteDTO_2.nome = 'Disfarçado - Cabelo liso + tesoura';
    tipoCorteDTO_2.valor = 15.00;

    tipoCorteDTO_3.id = '2';
    tipoCorteDTO_3.nome = 'Black';
    tipoCorteDTO_3.valor = 15.00;

    tipoCorteDTO_4.id = '3';
    tipoCorteDTO_4.nome = 'Disfarçado - Maquina 2 ou 1 ou 1/2';
    tipoCorteDTO_4.valor = 10.00;

    tipoCorteDTO_5.id = '4';
    tipoCorteDTO_5.nome = 'Disfarçado - Maquina >= 3';
    tipoCorteDTO_5.valor = 12.00;

    this.listaTipoCortes.push(tipoCorteDTO_1);
    this.listaTipoCortes.push(tipoCorteDTO_2);
    this.listaTipoCortes.push(tipoCorteDTO_3);
    this.listaTipoCortes.push(tipoCorteDTO_4);
    this.listaTipoCortes.push(tipoCorteDTO_5);

  }

}
