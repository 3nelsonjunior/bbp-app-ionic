import { UsuarioLogadoDTO } from './../../models/usuario-logado.dto';
import { Injectable } from "@angular/core";
import { DiaBarbeariaDTO } from "../../models/dia-barbearia.dto";


@Injectable()
export class DateUtilService {

    public diaSemanaString:string[] = [   "Domingo", "Segunda-Feira", "Terça-Feira", 
                                    "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"
                                ];

    constructor(
    ) { }

    inicializarDia(diaNovoModal: DiaBarbeariaDTO, usuarioLogado: UsuarioLogadoDTO): DiaBarbeariaDTO {
        diaNovoModal.id = null;
        diaNovoModal.data = this.dateToNumber(new Date());
        diaNovoModal.isAberto = true;
        diaNovoModal.isLiberadoCliente = false;
        diaNovoModal.usuarioAbrirDia = usuarioLogado;
        diaNovoModal.usuarioFecharDia = null;
        diaNovoModal.horaInicioDia = null;
        diaNovoModal.horaFecharDia = null;
        diaNovoModal.listaHorario = [];

        diaNovoModal.dataExibicao = this.NumberDateToFormatStringDateBR(diaNovoModal.data);
        diaNovoModal.diaDaSemana = this.getDiaSemana(diaNovoModal.data);
        diaNovoModal.diaExibicao = this.getStringDia(diaNovoModal.data);
        return diaNovoModal;
    }

    criarListaHorarios(horainicio: number, horaFim: number): string[] {
        let listaHorarios: string[] = [];
        let totalHorarios = (horaFim - horainicio) * 2;
        let zeroMinuto: string = '00';
        let meiaHora: string = '30';
        let doisPontos: string = ':';
        let horaCont: number = horainicio;


        let j: number = 0;
        for (let i = 0; i < totalHorarios / 2; i++) {
            if (horaCont > 23) {
                break;
            }
            if (i == 0) {
                horaCont = horainicio;
            }
            else {
                horaCont = horaCont + 1;
            }
            listaHorarios[j] = ('0' + horaCont).slice(-2).concat(doisPontos + zeroMinuto);
            listaHorarios[j + 1] = ('0' + horaCont).slice(-2).concat(doisPontos + meiaHora);
            j = j + 2;
            if (horaCont + 1 > 23) {
                break;
            }
        }
        return listaHorarios;
    }

    preencherComboHorario(horainicio: number, horaFim: number): string[] {
        let listaHorarios: string[] = [];
        let totalHorarios = (horaFim - horainicio);
        let zeroMinuto: string = '00';
        let doisPontos: string = ':';
        let horaCont: number = horainicio;


        for (let i = 0; i < totalHorarios; i++) {
            if (horaCont > 23) {
                break;
            }
            if (i == 0) {
                horaCont = horainicio;
            }
            else {
                horaCont = horaCont + 1;
            }
            listaHorarios[i] = ('0' + horaCont).slice(-2).concat(doisPontos + zeroMinuto);
            if (horaCont + 1 > 23) {
                break;
            }
        }
        return listaHorarios;
    }
    
    dateToNumber(data: Date): number {
        let dataCustomizada: string;
        dataCustomizada = data.getFullYear().toString()
            .concat(('0' + (data.getMonth() + 1).toString()).slice(-2))
            .concat(('0' + data.getDate().toString()).slice(-2))
        return Number(dataCustomizada);
    }

    dateToString(data: Date): string {
        let dataString: string;
        dataString =   data.getFullYear().toString()
                            .concat(('0' + (data.getMonth() + 1).toString()).slice(-2))
                            .concat(('0' + data.getDate().toString()).slice(-2))
        return dataString;
    }

    NumberToDate(dataNumber: number): Date {
        let dataString: string;
        let data: Date;
        let ano: string;
        let mes: string;
        let dia: string;

        dataString = String(dataNumber);

        ano = dataString.substring(0, 4);
        mes = dataString.substring(4, 6);
        dia = dataString.substring(6, 8);

        dataString = ano.concat('/' + mes).concat('/' + dia);
        data = new Date(dataString);

        return data;
    }

    NumberDateToFormatStringDateBR(dataNumber: number): string {
        let dataString: string;
        let ano: string;
        let mes: string;
        let dia: string;

        dataString = String(dataNumber);

        ano = dataString.substring(0, 4);
        mes = dataString.substring(4, 6);
        dia = dataString.substring(6, 8);

        dataString = dia.concat('/' + mes).concat('/' + ano);

        return dataString;
    }

    NumberDateToFormatStringDateUS(dataNumber: number): string {
        let dataString: string;
        let ano: string;
        let mes: string;
        let dia: string;

        dataString = String(dataNumber);

        ano = dataString.substring(0, 4);
        mes = dataString.substring(4, 6);
        dia = dataString.substring(6, 8);

        dataString = ano.concat('/' + mes).concat('/' + dia);

        return dataString;
    }

    getStringDia(dataNumber: number): string {
        let dataString: string;
        let dia: string;

        dataString = String(dataNumber);
        dia = dataString.substring(6, 8);

        return dia;
    }

    getDiaSemana(dataNumber: number): string {
        let diaString: string;
        let data: Date;
        let diaSemanaNumber: number;
        
        diaString = this.NumberDateToFormatStringDateUS(dataNumber);
        data = new Date(diaString);
        diaSemanaNumber = data.getDay();

        return this.diaSemanaString[diaSemanaNumber];
    }

    getProximoDia(dataNumber: number): number {
        let data: Date;
        let dataAmanha: Date;
        
        data = this.NumberToDate(dataNumber);
        dataAmanha = new Date(data.getTime() + (24 * 60 * 60 * 1000));

        return this.dateToNumber(dataAmanha);
    }

    getDiaAnterior(dataNumber: number): number {
        let data: Date;
        let dataOntem: Date;
        
        data = this.NumberToDate(dataNumber);
        dataOntem = new Date(data.getTime() - (24 * 60 * 60 * 1000));
        
        return this.dateToNumber(dataOntem);
    }

    getAddOuSubDias(dataNumber: number, dias: number): number {
        let data: Date;
        let dataCalculada: Date;
        
        data = this.NumberToDate(dataNumber);
        dataCalculada = new Date(data.getTime() + (dias * 24 * 60 * 60 * 1000));

        return this.dateToNumber(dataCalculada);
    }

}