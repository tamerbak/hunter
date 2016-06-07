import {NavController} from 'ionic-angular';
import {EntreprisePage} from '../entreprise/entreprise';
import {OffrePage} from '../offre/offre';
import {ContactsPage} from '../contacts/contacts';
import {Component} from "@angular/core";


@Component({
  templateUrl: 'build/pages/additional-details/additional-details.html'
})
export class AdditionalDetailsPage {

  constructor(public nav: NavController) {
    // set the root pages for each tab
    this.tab1Root = EntreprisePage;
    this.tab2Root = OffrePage;
    this.tab3Root = ContactsPage;
    
  }
}
