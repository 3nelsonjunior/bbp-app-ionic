import { API_CONFIG } from './../../config/api.config';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs/Rx';
import { EnderecoDTO } from '../../models/endereco.dto';

@Injectable()
export class EnderecoService {

    constructor(
        public httpClient: HttpClient,
    ) { }

    getEnderecoPorCEP(cep: number): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            })
        };
        return this.httpClient.get<any>(`${API_CONFIG.baseUrlCEP}/${cep}/json/`, httpOptions);
    }

    getListaEndereco(): Observable<EnderecoDTO[]> {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type':  'application/json'}),
        };
        return this.httpClient.get<EnderecoDTO[]>(`${API_CONFIG.baseUrl}/enderecos/lista`, httpOptions);
    }

    getListaEnderecoPorUsuario(usuarioId: string): Observable<EnderecoDTO[]>{
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type':  'application/json'}),
            params: new HttpParams().set('usuarioId', usuarioId),
        };
        return this.httpClient.get<EnderecoDTO[]>(`${API_CONFIG.baseUrl}/enderecos/por-usuario`, 
            httpOptions
        );
    }

    postEndereco(novoEndereco: EnderecoDTO): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            })
        };
        return this.httpClient.post(`${API_CONFIG.baseUrl}/enderecos`, 
        novoEndereco,
            httpOptions
        );
    }

    putEndereco(enderecoId: string, enderecoDTO: EnderecoDTO): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            })
        };
        return this.httpClient.put(`${API_CONFIG.baseUrl}/enderecos/${enderecoId}`, 
            enderecoDTO,
            httpOptions
        );
    }

    deleteEndereco(enderecoId: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            })
        };
        return this.httpClient.delete(`${API_CONFIG.baseUrl}/enderecos/${enderecoId}`, 
            httpOptions
        );
    }

    deleteEnderecoPorUsuario(usuarioId: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type':  'application/json', }),
            params: new HttpParams().set('usuarioId', usuarioId),
        };
        return this.httpClient.delete(`${API_CONFIG.baseUrl}/enderecos/por-usuario`, 
            httpOptions
        );
    }


}