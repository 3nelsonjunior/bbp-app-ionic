import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GuardiaoService } from '../../dev/services/autenticacao/guardiao.service';
import { LocalStorageUsuarioService } from '../../dev/services/local-storage/local-storage-usuario.service';
import { LocalStorageTokenService } from '../../dev/services/local-storage/local-storage-token.service';

import { UsuarioLogadoDTO } from '../../dev/models/usuario-logado.dto';

@IonicPage()
@Component({
  selector: 'page-barbearia',
  templateUrl: 'barbearia.html',
})
export class BarbeariaPage {

  public servicoPage = 'BarbeariaServicosPage';
  public horarioPage = 'BarbeariaMarcarHorarioPage';
  public diaPage = 'BarbeariaControleDiaPage';
  public usuarioLogado: UsuarioLogadoDTO = new UsuarioLogadoDTO();
  //public tituloBarbearia: string = 'Barbearia - Marcar horário';
  public tituloBarbearia: string = 'Barbearia';


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public lsUsuarioService: LocalStorageUsuarioService,
    public lsTokenService: LocalStorageTokenService,
    public guardiaoService: GuardiaoService,
  ) {
    this.usuarioLogado = lsUsuarioService.getLocalStorageUsuario().usuarioLogado;
  }

  ionViewCanEnter() {
    if(this.guardiaoService.existeUsuarioLogado()) {
      return true;
    } else {
      return false;
    }    
  }

  changeTab(tab) {
    /* if(tab.root === 'BarbeariaServicosPage') {
      this.tituloBarbearia = 'Barbearia - Serviços Oferecidos';
    } else if(tab.root === 'BarbeariaMarcarHorarioPage') {
      this.tituloBarbearia = 'Barbearia - Marcar horário';
    } else  if(tab.root === 'BarbeariaControleDiaPage') {
      this.tituloBarbearia = 'Barbearia - Controle de dias';
    } */
  }



}
