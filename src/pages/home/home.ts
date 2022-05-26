import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, Slides } from 'ionic-angular';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { resolveDefinition } from '../../../node_modules/@angular/core/src/view/util';
import { Observable, Observer } from '../../../node_modules/rxjs';
import { DomSanitizer } from '../../../node_modules/@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;
  base64Image;

  constructor(
    public navCtrl: NavController,
    public  socialSharing: SocialSharing,
    public sanitizer: DomSanitizer,
  ) {

  }


  abrirUsuarioPage() {
    this.navCtrl.push('UsuarioPage');
  }

  abrirMarcarHorario() {
    this.navCtrl.push('BarbeariaPage');
  }

  compartilharFacebook() {
    let foto_teste = 'assets/imgs/slides/barbearia.jpg';
    this.convertUrlToImageString(foto_teste);
    console.log(this.base64Image);
    this.socialSharing.shareViaFacebook('Teste foto Barbearia', this.base64Image, null);
  }

  compartilharInstagram() {
    let foto_teste = 'assets/imgs/slides/barbearia.jpg';
    this.socialSharing.shareViaInstagram('Teste foto Barbearia', foto_teste);
  }

  compartilharTwitter() {
    let foto_teste = 'assets/imgs/slides/barbearia.jpg';
    this.socialSharing.shareViaTwitter('Teste foto Barbearia', foto_teste, null);
  }

  compartilharWhatapp() {
    let foto_teste = 'assets/imgs/slides/barbearia.jpg';
    this.socialSharing.shareViaWhatsApp('Teste foto Barbearia', foto_teste, null);
  }

  compartilhar() {
    let foto_teste = 'assets/imgs/slides/barbearia.jpg';
    this.socialSharing.share('Teste foto Barbearia', null, foto_teste, null);
  }

  convertUrlToImageString(imageUrl: string) {
    this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
      //console.log(base64data);
      this.base64Image =  base64data;
    });
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

}
