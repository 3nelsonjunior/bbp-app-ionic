import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions } from '@angular/http';

import { API_CONFIG } from "../../config/api.config";
import { LocalStorageTokenService } from "../local-storage/local-storage-token.service";

@Injectable()
export class GenericUtilService {

    constructor(
        public http: Http,
        public lsTokenService: LocalStorageTokenService,
    ) { }

    

    getEnderecoPorCEP(cep: number) {
        let headers = new Headers({'Content-Type':  'application/json'});
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${API_CONFIG.baseUrlCEP}/${cep}/json/`, options);
    }


}