import { UsuarioLogadoDTO } from './usuario-logado.dto';


export class TipoDiaDTO {
    id: string;
    nome: string;
    horaInicioDia: number;
    horaFimDia: number;

    constructor (
        id?: string, nome?: string, horaInicioDia?: number , horaFimDia?: number
    ) {
        this.id = id;
        this.nome = nome;
        this.horaInicioDia = horaInicioDia;
        this.horaFimDia = horaFimDia;  
    }
}
