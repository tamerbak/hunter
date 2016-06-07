import {NavController, Page} from 'ionic-angular';
import {EntreprisePage} from '../entreprise/entreprise';
import {OffrePage} from '../offre/offre';
import {ContactsPage} from '../contacts/contacts';


@Page({
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
