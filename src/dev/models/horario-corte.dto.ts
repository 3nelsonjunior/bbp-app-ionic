import { TipoCorteDTO } from './tipo-corte.dto';
import { UsuarioLogadoDTO } from './usuario-logado.dto';
import { DiaBarbeariaDTO } from './dia-barbearia.dto';

export class HorarioCorteDTO {
    id: string;
    dia: DiaBarbeariaDTO;
    horaInicio: string;
    clienteHorario: UsuarioLogadoDTO;
    barbeiroHorario: UsuarioLogadoDTO;
    usuarioMarcarHorario: UsuarioLogadoDTO;
    corteHorario: TipoCorteDTO;
    foiAtendido: boolean;
    barba: boolean;


    constructor (
        id?: string, dia?: DiaBarbeariaDTO, horaInicio?: string, clienteHorario?: UsuarioLogadoDTO, 
        barbeiroHorario?: UsuarioLogadoDTO, usuarioMarcarHorario?: UsuarioLogadoDTO, corteHorario?: TipoCorteDTO,
        foiAtendido?: boolean, barba?: boolean
    ) {
        this.id = id;
        this.dia = dia;
        this.horaInicio = horaInicio;
        this.clienteHorario = clienteHorario;
        this.barbeiroHorario = barbeiroHorario;
        this.usuarioMarcarHorario = usuarioMarcarHorario;
        this.corteHorario = corteHorario;
        this.foiAtendido = foiAtendido;
        this.barba = barba;
    }
}

