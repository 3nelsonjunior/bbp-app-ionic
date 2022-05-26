import { DiaBarbeariaDTO } from './../../dev/models/dia-barbearia.dto';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'folhinha-component',
  templateUrl: 'folhinha.component.html'
})
export class FolhinhaComponent {

  @Input() dia: DiaBarbeariaDTO = new DiaBarbeariaDTO();
  

  constructor() {
    
  }

  

    

}