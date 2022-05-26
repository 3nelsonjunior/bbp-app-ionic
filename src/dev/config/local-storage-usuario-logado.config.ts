import { UsuarioLogadoDTO } from './../models/usuario-logado.dto';

export interface LocalStorageUsuario {
    isLogado: boolean,
    usuarioLogado: UsuarioLogadoDTO,
}