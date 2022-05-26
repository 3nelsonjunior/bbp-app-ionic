import { TipoCorteDTO } from './tipo-corte.dto';
import { DiaDTO } from './dia.dto';
import { UsuarioDTO } from './usuario.dto';
import { UsuarioLogadoDTO } from './usuario-logado.dto';

export class HorarioDTO {
    id: string;
    dia: DiaDTO;
    horaInicio: Date;
    horaFim: Date;
    clienteHorario: UsuarioDTO;
    barbeiroHorario: UsuarioDTO;
    usuarioMarcarHorario: UsuarioLogadoDTO;
    corteHorario: TipoCorteDTO;
    isAtendido: boolean;
    isBarba: boolean;
    isLavarCabelo: boolean;


    constructor (
        id?: string, dia?: DiaDTO, horaInicio?: Date, horaFim?: Date,
        clienteHorario?: UsuarioDTO, barbeiroHorario?: UsuarioDTO, usuarioMarcarHorario?: UsuarioLogadoDTO, corteHorario?: TipoCorteDTO,
        isAtendido?: boolean, isBarba?: boolean, isLavarCabelo?: boolean
    ) {
        this.id = id;
        this.dia = dia;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.clienteHorario = clienteHorario;
        this.barbeiroHorario = barbeiroHorario;
        this.usuarioMarcarHorario = usuarioMarcarHorario;
        this.corteHorario = corteHorario;
        this.isAtendido = isAtendido;
        this.isBarba = isBarba;
        this.isLavarCabelo = isLavarCabelo;
    }
}

