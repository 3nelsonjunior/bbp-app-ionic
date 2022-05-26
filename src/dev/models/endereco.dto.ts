import { UsuarioDTO } from './usuario.dto';

export class EnderecoDTO {
    id: string;
    logradouro: string;
    numero: string;
    complemento: Date;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    pais: string;
    usuario: UsuarioDTO


    constructor (
        id?: string, logradouro?: string, numero?: string, complemento?: string,
        bairro?: string, cidade?: string, estado?: string, cep?: string,
        pais?: string, usuario?: UsuarioDTO
    ) {
        this.id = id;
        this.logradouro = logradouro;
        this.numero = numero;
        this.bairro = bairro;  
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
        this.pais = pais;  
        this.usuario = new UsuarioDTO;
    }
}