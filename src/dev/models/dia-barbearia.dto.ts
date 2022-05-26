import { HorarioCorteDTO } from './horario-corte.dto';
import { UsuarioLogadoDTO } from './usuario-logado.dto';

export class DiaBarbeariaDTO {
    id: string;
    data: number;
    isAberto: boolean;
    isLiberadoCliente: boolean;
    usuarioAbrirDia: UsuarioLogadoDTO = new UsuarioLogadoDTO();
    usuarioFecharDia: UsuarioLogadoDTO = new UsuarioLogadoDTO();
    horaInicioDia: number;
    horaFecharDia: number;
    listaHorario: HorarioCorteDTO[] = [];

    dataExibicao: string;
    diaDaSemana: string;
    diaExibicao: string;

    constructor (
        id?: string, data?: number, isAberto?: boolean, isLiberadoCliente?: boolean,
        usuarioAbrirDia?: UsuarioLogadoDTO, usuarioFecharDia?: UsuarioLogadoDTO,
        horaInicioDia?: number, horaFecharDia?: number, listaHorario?: HorarioCorteDTO[],
        dataExibicao?: string, diaDaSemana?: string, diaExibicao?: string
    ) {
        this.id = id;
        this.data = data;
        this.isAberto = isAberto;
        this.isLiberadoCliente = isLiberadoCliente;
        this.usuarioAbrirDia = usuarioAbrirDia;
        this.usuarioFecharDia = usuarioFecharDia;
        this.horaFecharDia = horaFecharDia;
        this.horaInicioDia = horaInicioDia;
        this.listaHorario = listaHorario;
        this.dataExibicao = dataExibicao;
        this.diaDaSemana = diaDaSemana;
        this.diaExibicao = diaExibicao;
    }
}
