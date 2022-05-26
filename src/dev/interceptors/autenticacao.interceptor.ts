import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import { LocalStorageTokenService } from "../services/local-storage/local-storage-token.service";
import { AutenticacaoService } from "../services/autenticacao/autenticacao.service";
import { TokenDTO } from "../models/token.dto";
import { API_CONFIG } from "../config/api.config";


@Injectable()
export class AutenticacaoInterceptor implements HttpInterceptor {
    public lsToken: TokenDTO = new TokenDTO();
    constructor(
        public lsTokenService: LocalStorageTokenService,
        public autenticacaoService: AutenticacaoService,
    ) {   }
    
    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpSentEvent | HttpHeaderResponse |
        HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
            this.lsToken = this.lsTokenService.getLocalStorageToken().tokenValido;
            return next.handle(
                req.clone({
                    setHeaders:
                        { Authorization: 'Bearer ' + this.lsToken.access_token }
                })).catch(error => {
                    if (error instanceof HttpErrorResponse) {
                        switch ((<HttpErrorResponse>error).status) {
                            case 401:
                                return this.obterTokenPorRefreshToken(req, next);
                            case 0:
                                return this.obterTokenPorRefreshToken(req, next);
                        }
                        Observable.throw(error);
                    } else {
                        Observable.throw(error);
                    }
                }
                );
        
    }

    private obterTokenPorRefreshToken(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return this.autenticacaoService.getAuthTokenPorRefreshToken().switchMap(
            resposta => {
                this.lsTokenService.setLocalStorageToken(resposta);
                this.lsToken = this.lsTokenService.getLocalStorageToken().tokenValido;
                return next.handle(req.clone({
                    setHeaders:
                        { Authorization: 'Bearer ' + this.lsToken.access_token }
                }));
            }
        )
    }
    
}

export const AutenticacaoInterceptorService = {
    provide: HTTP_INTERCEPTORS,
    useClass: AutenticacaoInterceptor,
    multi: true,
};
