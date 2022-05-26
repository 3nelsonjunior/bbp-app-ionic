import { UsuarioLogadoDTO } from './usuario-logado.dto';
import { TipoDiaDTO } from './tipo-dia.dto';
import { DataCustomizadaDTO } from './data-customizada';


export class DiaDTO {
    id: string;
    data: Date;
    tipoDia: TipoDiaDTO;
    isAberto: boolean;
    usuarioAbrirDia: UsuarioLogadoDTO = new UsuarioLogadoDTO();
    usuarioFecharDia: UsuarioLogadoDTO = new UsuarioLogadoDTO();

    dataCustomizadaDTO: DataCustomizadaDTO = new DataCustomizadaDTO();
    isDiaAtual: boolean;

    constructor (
        id?: string, data?: Date, tipoDia?: TipoDiaDTO, isAberto?: boolean,
        usuarioAbrirDia?: UsuarioLogadoDTO, usuarioFecharDia?: UsuarioLogadoDTO,
        dataCustomizadaDTO?: DataCustomizadaDTO, isDiaAtual?: boolean 
    ) {
        this.id = id;
        this.data = data;
        this.tipoDia = tipoDia;
        this.isAberto = isAberto;
        this.usuarioAbrirDia = usuarioAbrirDia;
        this.usuarioFecharDia = usuarioFecharDia;
        this.dataCustomizadaDTO = dataCustomizadaDTO;
        this.isDiaAtual = isDiaAtual;
    }
}
