import { PerfilDTO } from "./perfil.dto";

export class UsuarioDTO {
    id: string;
    nome: string;
    apelido: string;
    dtNasc: Date;
    email: string;
    telefone1: string;
    telefone2: string;
    telefone3: string;
    ativo: boolean;
    urlFoto: string;
    perfis: PerfilDTO[] = [];

    constructor (
        id?: string, nome?: string, apelido?: string, dtNasc?: Date,
        email?: string, senha?: string, telefone1?: string, telefone2?: string,
        telefone3?: string, ativo?: boolean, urlFoto?: string, perfis?: PerfilDTO[]
    ) {
        this.id = id;
        this.nome = nome;
        this.apelido = apelido;
        this.dtNasc = dtNasc;  
        this.email = email;
        this.telefone1 = telefone1;
        this.telefone2 = telefone2;  
        this.telefone3 = telefone3;
        this.ativo = ativo;
        this.urlFoto = urlFoto;
        this.perfis = perfis;
    }
}