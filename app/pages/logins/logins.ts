import {NavController, Page, NavParams} from 'ionic-angular';
import {GlobalConfigs} from '../../configurations/globalConfigs';
import {PhonePage} from '../phone/phone';
import {MailPage} from '../mail/mail';


@Page({
  templateUrl: 'build/pages/logins/logins.html',
  providers: [GlobalConfigs]
})
export class LoginsPage {

  phoneRoot: any;
  mailRoot: any;
  nav: any;
  selectedItem: any;
  phoneTabTitle : string;
  mailTabTitle: string;

  constructor(public nav: NavController,
              navParams: NavParams) {
    // set the root pages for each tab
    this.phoneRoot = PhonePage;
    this.mailRoot = MailPage;
    this.nav = nav;
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');


    // Set local variables and messages
    this.phoneTabTitle = "Téléphone";
    this.mailTabTitle = "E-mail";
  }
}
