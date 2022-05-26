import { Injectable, ViewChild } from "@angular/core";
import { LocalStorageUsuarioService } from "../local-storage/local-storage-usuario.service";

@Injectable()
export class GuardiaoService {

    constructor(
        public lsUsuarioService: LocalStorageUsuarioService,
    ) { }

    existeUsuarioLogado(): boolean {
        if (this.verificaSeExisteUsuarioLogado() === null || this.verificaSeExisteUsuarioLogado() === undefined) {
            //console.log('null ou undefined');
            return false;
        } else if(!this.verificaSeExisteUsuarioLogado()){
            //console.log('false');
            return false;
        } else if(this.verificaSeExisteUsuarioLogado()){
            //console.log('logado');
            return true;
        } 
    }

    verificaSeExisteUsuarioLogado(): boolean {
        return this.lsUsuarioService.getLocalStorageUsuario().isLogado;
    }

}