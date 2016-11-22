import { Component } from '@angular/core';
import {
    NavController, Platform, SqlStorage, Storage, Alert, Picker, PickerColumnOption, Toast,
    NavParams, Loading
} from 'ionic-angular';
import {HomePage} from "../home/home";
import {EnterpriseAddService} from "../../providers/enterprise-add-service/enterprise-add-service";
import {GooglePlaces} from "../../components/google-places/google-places";
import {AppAvailability} from "ionic-native";
import {AuthenticationService} from "../../providers/authentication.service";
import {GlobalService} from "../../providers/global.service";

/*
  Generated class for the OpportunityFillPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/opportunity-fill/opportunity-fill.html',
  providers: [EnterpriseAddService, AuthenticationService, GlobalService],
  directives: [GooglePlaces]
})
export class OpportunityFillPage {

  private enterpriseCard:any;
  private selectedPlace:any;
  private nav:any;
  private service:any;
  private isMailValide:any;
  private db:any;
  private popover:any;
  private listSectors:any;
  private listJobs:any;
  private validators:any;
  private platform;
  private isIOS;
  private opportunity: any;
  private target:string;
  private isEmpInstalled:boolean = false;
  private isJobInstalled:boolean = false;
  private user:any;
  private authService:any;
  private globalService:any;

  constructor(private _navController:NavController, _service:EnterpriseAddService,
              platform:Platform, params:NavParams, _authService:AuthenticationService, _globalService:GlobalService) {
    this.service = _service;
    this.nav = _navController;
    this.db = new Storage(SqlStorage);
    this.platform = platform;
    this.isIOS = this.platform.is('ios');
    this.target = params.get('target');
    this.authService = _authService;
    this.globalService = _globalService;
    let app;
    if (this.isIOS) {
      app = (this.target === 'Employeur') ? 'employeur://' : 'jobyer://';
    } else if (platform.is('android')) {
      app = (this.target === 'Employeur') ? 'com.manaona.vitonjob.employeur' : 'com.manaona.vitonjob.jobyer';
    }

    AppAvailability.check(app)
        .then(
            () => {
              if (this.target === 'Employeur')
                this.isEmpInstalled = true;
              else this.isJobInstalled = true;
            },
            () => {
              if (this.target === 'Employeur')
                this.isEmpInstalled = false;
              else this.isJobInstalled = false;
            }
        );

    this.enterpriseCard = {
      employer: {
        firstName: '',
        lastName: '',
        phone: '',
        mail: ''
      },
      enterprise: {
        name: '',
        address: ''
      },
      offer: {
        idSector: 0,
        sector: '',
        idJob: 0,
        job: ''
      },
      hunter: {
        mail:'',
        phone:''
      }
    };

    this.opportunity = this.enterpriseCard.offer;
    this.db.get('OPPORTUNITY').then(opp => {
     
      if (opp) {
        let obj = JSON.parse(opp);
        //debugger;
        if (obj) {
          this.enterpriseCard.offer.sector = obj.offer.sector;
          this.enterpriseCard.offer.idSector = obj.offer.idSector;
          this.enterpriseCard.offer.job = obj.offer.job;
          this.enterpriseCard.offer.idJob = obj.offer.idJob;
          this.opportunity = obj;
        }
      }
    });

    this.db.get('currentUser').then((value)=> {
      this.user = JSON.parse(value);
    });



    this.validators = {
      isEnterpriseName: false,
      isAddress: false,
      isEnterpriseCard: false,
      isSector: false,
      isJob: false,
      isOfferCard: false,
      isEmployerFirstName: false,
      isEmployerLastName: false,
      isPhone: false,
      isMail: false,
      isEmployerCard: false
    };

    /*this.service.loadSectors().then(listSectors => {
      if (listSectors) {
        this.listSectors = listSectors;
        this.db.set('listSectors', JSON.stringify(listSectors));
      }
    });

    this.service.loadJobs().then(listJobs => {
      if (listJobs) {
        this.listJobs = listJobs;
        this.db.set('listJobs', JSON.stringify(listJobs));
      }
    });*/
  }

  /**
   * @description function to get the selected result in the google place autocomplete
   */
  showResults(place) {
    this.selectedPlace = place;
    this.enterpriseCard.enterprise.address = place.formatted_address;
    this.validators.isAddress = true;

  }

  sendCard() {

    let _phone:string;
    let _mail:string;
    let _id:string;

    this.db.get('userData').then(userData => {
      if (userData) {
        userData = JSON.parse(userData);
        _phone = userData.phone;
        _mail = userData.mail;
        _id = userData.id;
      }

      let alert = Alert.create({
        title: 'Hunter Junior',
        subTitle: 'Identifiez-vous',
        message: 'Afin de vous attribuer cette capture d’opportunité, merci de saisir ou de valider votre adresse email et numéro de téléphone',
        inputs: [
          {
            name: 'mail',
            placeholder: 'e-Mail',
            value: _mail ? _mail : ''
          },
          {
            name: 'phone',
            placeholder: 'Téléphone',
            type: 'tel',
            value: _phone ? _phone : ''
          }
        ],
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: data => {
              if ((data.mail) && (data.phone)) {

                let hunterData = {phone : data.phone, mail: data.mail};
                this.service.sendData(this.enterpriseCard, hunterData).then( opportunityData => {
                  let userData = {
                    phone: opportunityData.hunter.phone,
                    mail: opportunityData.hunter.mail,
                    id: opportunityData.hunter.id
                  };
                  this.db.set('userData', JSON.stringify(userData));
                  let toast = Toast.create({
                    message: 'Félicitations! vos données sont bien enregistrées.',
                    duration: 5000
                  });
                  this.nav.present(toast);
                });
                /* Data loaded now we pop to home*/
                alert.dismiss().then(() => {
                  this.nav.pop(HomePage);
                });
              } else {
                // invalid data
                return false;
              }

            }
          }
        ]
      });
      this.nav.present(alert);
    });
  }

  /**
   * @description validate phone data field and call the function that search for it in the server
   */
  watchPhone(e) {
    /*if (this.enterpriseCard.employer.phone) {
     if (this.enterpriseCard.employer.phone.length == 9) {
     //get the 9th entered character
     return;
     }
     if (this.enterpriseCard.employer.phone.length > 9) {
     this.enterpriseCard.employer.phone = this.enterpriseCard.employer.phone.substring(0, 9);
     return;
     }
     }*/

    if (e.target.value) {
      //this.isPhoneNumValid = false;
      if (e.target.value.includes('.')) {
        e.target.value = e.target.value.replace('.', '');
      }
      if (e.target.value.length > 9) {
        e.target.value = e.target.value.substring(0, 9);
      }
      if (e.target.value.length == 9) {
        if (e.target.value.substring(0, 1) == '0') {
          e.target.value = e.target.value.substring(1, e.target.value.length);
        }
        //this.isPhoneNumValid = true;
      }

    }
  }

  /**
   * @description show error msg if phone is not valid
   */
  showPhoneError() {
    if (this.enterpriseCard.employer.phone)
      return (this.enterpriseCard.employer.phone.length != 9);
  }

  /**
   * @description check if an email is valid
   * @param id of the email component
   */
  checkEmail(email) {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    var isMatchRegex = EMAIL_REGEXP.test(email);
    return isMatchRegex;
  }

  /**
   * @description validate the email format
   */
  showEmailError() {
    if (this.enterpriseCard.employer.mail)
      return !(this.checkEmail(this.enterpriseCard.employer.mail));
    else
      return false
  }


  /**
   * Sectors picker
   */
  setSectorsPicker() {
    let rating = 0;
    let picker = Picker.create();
    let options:PickerColumnOption[] = new Array<PickerColumnOption>();

    this.db.get('listSectors').then(listSectors => {
      if (listSectors) {
        listSectors = JSON.parse(listSectors);
        for (let i = 1; i < listSectors.length; i++) {
          options.push({
            value: listSectors[i].id,
            text: listSectors[i].label
          })
        }
      }
      let column = {
        selectedIndex: 0,
        options: options
      };

      picker.addColumn(column);
      picker.addButton('Annuler');
      picker.addButton({
        text: 'Valider',
        handler: data => {
          this.enterpriseCard.offer.sector = data.undefined.text;
          this.enterpriseCard.offer.idSector = data.undefined.value;
          this.filterJobList();
          this.enterpriseCard.offer.job = '';
          this.enterpriseCard.offer.idJob = 0;
          this.opportunity.offer = {sector:data.undefined.text,idSector: data.undefined.value, job:"", idJob:0};
          this.db.set('OPPORTUNITY', JSON.stringify(this.opportunity));
        }
      });
      picker.setCssClass('sectorPicker');
      this.nav.present(picker);

    });
  }

  /**
   * Sectors picker
   */
  setJobsPicker() {
    let rating = 0;
    let picker = Picker.create();
    let options:PickerColumnOption[] = new Array<PickerColumnOption>();


    this.db.get('listJobs').then(
        list => {
          if (list) {
            list = JSON.parse(list);
            let q = this.enterpriseCard.offer.idSector;

            // if the value is an empty string don't filter the items
            if (!(q === '')) {
              list = list.filter((v) => {
                return (v.idsector == q);
              });
            }

            this.listJobs = list;
            for (let i = 1; i < this.listJobs.length; i++) {
              options.push({
                value: this.listJobs[i].id,
                text: this.listJobs[i].label
              })
            }
            let column = {
              selectedIndex: 0,
              options: options
            };

            picker.addColumn(column);
            picker.addButton('Annuler');
            picker.addButton({
              text: 'Valider',
              handler: data => {
                this.enterpriseCard.offer.job = data.undefined.text;
                this.enterpriseCard.offer.idJob = data.undefined.value;
                this.opportunity.offer.job = this.enterpriseCard.offer.job;
                this.opportunity.offer.idJob = this.enterpriseCard.offer.idJob;
                this.db.set('OPPORTUNITY', JSON.stringify(this.opportunity));
                this.presentToast("L'offre est bien enregistrée");
              }
            });
            picker.setCssClass('jobPicker');
            this.nav.present(picker);

          }
        }
    );

    /*this.service.loadJobs(this.enterpriseCard.offer.idSector).then(listJobs => {
     if (listJobs) {
     for (let i = 1; i < listJobs.length; i++) {
     options.push({
     value: listJobs[i].id,
     text: listJobs[i].label
     })
     }
     }
     let column = {
     selectedIndex: 0,
     options: options
     };

     picker.addColumn(column);
     picker.addButton('Annuler');
     picker.addButton({
     text: 'Valider',
     handler: data => {
     this.enterpriseCard.offer.job = data.undefined.text;
     this.enterpriseCard.offer.idJob = data.undefined.value;
     }
     });
     picker.setCssClass('jobPicker');
     this.nav.present(picker);

     });*/
  }

  filterSectorList(ev) {
    var q = ev.target.value;

    // if the value is an empty string don't filter the items
    if (q.trim() == '') {
      return;
    }

    this.listSectors = this.listSectors.filter((v) => {
      return (v.label.toLowerCase().indexOf(q.toLowerCase()) > -1);
    })
  }

  filterJobList() {

    this.db.get('listJobs').then(
        list => {
          if (list) {
            list = JSON.parse(list);
            let q = this.enterpriseCard.offer.idSector;

            // if the value is an empty string don't filter the items
            if (!(q === '')) {
              list = list.filter((v) => {
                return (v.idsector == q);
              });
              this.listJobs = list;
            }

          }
        }
    );

  }


  presentToast(message) {
    let toast = Toast.create({
      message: message,
      duration: 3000
    });

    toast.onDismiss(() => {
      console.log('Dismissed toast');
    });

    this.nav.present(toast);
  }


  sendPassword() {
    let loading = Loading.create({
      content: ` 
			<div>
			<img src='img/loading.gif' />
			</div>
			`,
      spinner: 'hide'
    });
    this.nav.present(loading);
    let tel = this.opportunity.tel;
    this.authService.setNewPassword(tel, this.target, this.user.id).then((data) => {
      if (!data) {
        loading.dismiss();
        this.globalService.showAlertValidation("Vit-On-Job", "Serveur non disponible ou problème de connexion.");
        return;
      }
      if (data && data.password.length != 0) {
        let newPassword = data.password;
        this.authService.sendPasswordBySMS(tel, newPassword).then((data) => {
          if (!data || data.status != 200) {
            loading.dismiss();
            this.globalService.showAlertValidation("Vit-On-Job", "Serveur non disponible ou problème de connexion.");
            return;
          }
          loading.dismiss();
        });
      }
    })
  }

}
