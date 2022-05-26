import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions } from '@angular/http';

import { API_CONFIG } from "../../config/api.config";
import { AutenticacaoDTO } from '../../models/autenticacao.dto';
import { LocalStorageTokenService } from "../local-storage/local-storage-token.service";

@Injectable()
export class AutenticacaoService {

    constructor(
        public http: Http,
        public lsTokenService: LocalStorageTokenService,
    ) { }

    getAuthToken(autenticacaoDTO: AutenticacaoDTO): Observable<any> {
        let autenticacao = `&username=${autenticacaoDTO.login}&password=${encodeURIComponent(autenticacaoDTO.senha)}`;
        let headers = new Headers({
            'Authorization': 'Basic ' + btoa('barbeariablackpower' + ':' + '123456')
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${API_CONFIG.tokenUrl}${autenticacao}`, {},options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getAuthTokenPorRefreshToken() {
        let refresh_token = this.lsTokenService.getLocalStorageToken().tokenValido.refresh_token;
        let headers = new Headers({
            'Authorization': 'Basic ' + btoa('barbeariablackpower' + ':' + '123456')
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${API_CONFIG.refresh_tokenUrl}=${refresh_token}`, {}, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getUsuarioLogado(usuarioLogado: string) {
        let access_token = this.lsTokenService.getLocalStorageToken().tokenValido.access_token;
        let headers = new Headers({ 'Authorization': "Bearer " + access_token });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${API_CONFIG.baseUrl}/usuarios/logado`, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json() || 'Erro no Servidor');
    }


}