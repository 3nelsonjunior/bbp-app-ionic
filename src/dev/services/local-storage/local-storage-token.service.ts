import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../../config/local-storage-key.config';
import { TokenDTO } from '../../models/token.dto';
import { LocalStorageToken } from '../../config/local-storage-token.config';

@Injectable()
export class LocalStorageTokenService {

    constructor() { }

    getLocalStorageToken(): LocalStorageToken {
        let tokenValido = localStorage.getItem(STORAGE_KEYS.KEY_TOKEN);
        if (tokenValido == null) {
            return null;
        } else {
            return JSON.parse(tokenValido);
        }
    }

    setLocalStorageToken(token: TokenDTO) {
        let LocalStorageToken = {
            tokenValido: token,
        };
        if (token == null) {
            console.log('Não há token!');
            this.setLocalStorageTokenOFF();
        } else {
            localStorage.setItem(STORAGE_KEYS.KEY_TOKEN, JSON.stringify(LocalStorageToken));
        }
    }

    setLocalStorageTokenOFF() {
        let localStorageTokenOFF = {
            tokenValido: new TokenDTO(),
        };
        localStorage.setItem(STORAGE_KEYS.KEY_TOKEN, JSON.stringify(localStorageTokenOFF));
    }

}
