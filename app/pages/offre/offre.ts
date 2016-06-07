import {Page, NavController} from 'ionic-angular';

/*
  Generated class for the OffrePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/offre/offre.html',
})
export class OffrePage {
  constructor(public nav: NavController) {}

  popScreen(){
    this.nav.pop();
  }
}
