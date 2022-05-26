import { SenhaDTO } from './../../models/senha.dto.';
import { UsuarioDTO } from './../../models/usuario.dto';
import { API_CONFIG } from './../../config/api.config';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs/Rx';
import { ImageUtilService } from '../util/image-util.service';
import { PerfilDTO } from '../../models/perfil.dto';
import { UsuarioPutDTO } from '../../models/usuario-put.dto';
import { UsuarioPostDTO } from '../../models/usuario-post.dto';
import { AutenticacaoDTO } from '../../models/autenticacao.dto';

@Injectable()
export class UsuarioService {

    constructor(
        public httpClient: HttpClient,
        public imageUtilService: ImageUtilService
    ) { }

    // login temporário até implementar o OAuth2.0
    getLogin(autenticacaoDTO: AutenticacaoDTO): Observable<any> {
        let loginGetDTO = {
            apelido: autenticacaoDTO.login,
            senha: autenticacaoDTO.senha,
        };
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type':  'application/json'}),
        };
        return this.httpClient.post(`${API_CONFIG.baseUrl}/usuarios/login`, loginGetDTO, httpOptions );
    }

    // login temporário até implementar o OAuth2.0
    getLoginFacebook(email: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type':  'application/json'}),
            params: new HttpParams().set('email', email),
        };
        return this.httpClient.get(`${API_CONFIG.baseUrl}/usuarios/login-facebook`, httpOptions)
    }

    getListaUsuario(): Observable<UsuarioDTO[]> {
        return this.httpClient.get<UsuarioDTO[]>(`${API_CONFIG.baseUrl}/usuarios`);
    }

    getUsuarioPorId(usuarioId: string): Observable<UsuarioDTO> {
        return this.httpClient.get<UsuarioDTO>(`${API_CONFIG.baseUrl}/usuarios/${usuarioId}`);
    }

    getFotoUsuario(usuarioId: string): Observable<any> {
        let url = `${API_CONFIG.baseUrl}/usuarios/${usuarioId}/imagem.png`;
        return this.httpClient.get(url, { responseType: 'blob' });
    }

    postUsuario(usuarioPostDTO: UsuarioPostDTO) {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            })
        };
        return this.httpClient.post(`${API_CONFIG.baseUrl}/usuarios`,
        usuarioPostDTO, 
            httpOptions,
        );
    }

    postGerarNovaSenha(email: String) {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            })
        };
        return this.httpClient.post(`${API_CONFIG.baseUrl}/emails/nova-senha/${email}`,
            httpOptions,
        );
    }

    postFotoUsuario(fotoUsuario: string, urlFoto: string) {
        let pictureBlob = this.imageUtilService.dataUriToBlob(fotoUsuario);
        let formData: FormData = new FormData();
        formData.set('image', pictureBlob, urlFoto + '.png');
        return this.httpClient.post(
            `${API_CONFIG.baseUrl}/usuarios/imagem`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    putUsuario(usuarioId: string, usuarioPutDTO: UsuarioPutDTO) {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            })
        };
        return this.httpClient.put(`${API_CONFIG.baseUrl}/usuarios/${usuarioId}`,
            usuarioPutDTO, 
            httpOptions,
        );
    }

    putPerfis(usuarioId: string, perfis: PerfilDTO[]) {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            })
        };
        return this.httpClient.put(`${API_CONFIG.baseUrl}/usuarios/${usuarioId}/alterar-perfis`,
        perfis, 
        httpOptions,
        );
    }

    putSenha(usuarioId: string, senhaDTO: SenhaDTO): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            })
        };
        return this.httpClient.put(`${API_CONFIG.baseUrl}/usuarios/${usuarioId}/alterar-senha`, 
            senhaDTO,
            httpOptions
        );
    }

    deleteUsuario(usuarioId: string) {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            })
        };
        return this.httpClient.delete(`${API_CONFIG.baseUrl}/usuarios/${usuarioId}`,
            httpOptions,
        );
    }

}