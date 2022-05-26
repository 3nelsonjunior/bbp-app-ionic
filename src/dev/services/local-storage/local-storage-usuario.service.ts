import { Injectable, ViewChild } from '@angular/core';
import { STORAGE_KEYS } from '../../config/local-storage-key.config';
import { Nav } from 'ionic-angular';
import { UsuarioLogadoDTO } from '../../models/usuario-logado.dto';
import { LocalStorageUsuario } from '../../config/local-storage-usuario-logado.config';

@Injectable()
export class LocalStorageUsuarioService {

    @ViewChild(Nav) nav: Nav;

    constructor() { }

    getLocalStorageUsuario(): LocalStorageUsuario {
        let usuarioLogado = localStorage.getItem(STORAGE_KEYS.KEY_USUARIO);
        if (usuarioLogado == null) {
            return null;
        } else {
            return JSON.parse(usuarioLogado);
        }
    }

    setLocalStorageUsuario(usuario: UsuarioLogadoDTO) {
        let LocalStorageUsuario = {
            isLogado: true,
            usuarioLogado: usuario,
        };
        if (usuario == null) {
            console.log('Não há usuário!');
            this.setLocalStorageUsuarioOFF();
        } else {
            LocalStorageUsuario.usuarioLogado.perfis.forEach(item => {
                delete(item.id);
            })
            localStorage.setItem(STORAGE_KEYS.KEY_USUARIO, JSON.stringify(LocalStorageUsuario));
        }
    }

    setLocalStorageUsuarioOFF() {
        let localStorageUsuarioOFF = {
            isLogado: false,
            usuarioLogado: new UsuarioLogadoDTO(),
        };
        localStorage.setItem(STORAGE_KEYS.KEY_USUARIO, JSON.stringify(localStorageUsuarioOFF));
    }

    existeUsuarioLogado(): boolean {
        return this.getLocalStorageUsuario().isLogado;
    }

    storageEventListener(event: StorageEvent) {
        if (event.storageArea == localStorage) {
          if(this.getLocalStorageUsuario().isLogado == null){
            this.nav.setRoot('LoginPage');
          } else if(!this.getLocalStorageUsuario().isLogado){
            this.nav.setRoot('LoginPage');
          }
        }
      }
    
}
