import { PerfilDTO } from "./perfil.dto";

export class UsuarioLogadoDTO {
    id: string;
    nome: string;
    apelido: string;
    urlFoto: string;
    perfis: PerfilDTO[] = [];

    constructor (id?: string, nome?: string, apelido?: string, urlFoto?: string, perfis?: PerfilDTO[]) {
        this.id = id;
        this.nome = nome;
        this.apelido = apelido;
        this.urlFoto = urlFoto;
        this.perfis = perfis;
    }

    
}