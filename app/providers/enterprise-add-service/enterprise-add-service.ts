import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the EnterpriseAddService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class EnterpriseAddService {
  data:any = null;
  addEmployerData:any = null;
  addAddressData:any = null;
  addUserData:any = null;
  listSectors:any = null;
  listJobs:any = null;
  remoteData: any= null;
  private sqlURL:string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/sql';
  private calloutURL:string = 'http://vitonjobv1.datqvvgppi.us-west-2.elasticbeanstalk.com/api/business';

  constructor(public http:Http) {
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('path/to/data.json')
          .map(res => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            this.data = data;
            resolve(this.data);
          });
    });
  }


  /**
   * send all data to remote database.
   * @param enterpriseCard
   * @param hunterData
   * @returns {Promise}
   */
  sendData(enterpriseCard:any, hunterData: any) {

    //Prepare the request
    let login:any = {
      class: "com.vitonjob.hunter.HunterToken",
      employer: {
        class: "com.vitonjob.hunter.Employer",
        id : 0,
        firstName: enterpriseCard.employer.firstName,
        lastName: enterpriseCard.employer.lastName,
        phone: enterpriseCard.employer.phone,
        mail: enterpriseCard.employer.mail
      },
      enterprise: {
        class: "com.vitonjob.hunter.Enterprise",
        id : 0,
        name: enterpriseCard.enterprise.name,
        adress: enterpriseCard.enterprise.address
      },
      offer: {
        class: "com.vitonjob.hunter.Offer",
        id : 0,
        idSector: enterpriseCard.offer.idSector,
        sector: enterpriseCard.offer.sector,
        idJob: enterpriseCard.offer.idJob,
        job: enterpriseCard.offer.job
      },
      hunter: {
        class: "com.vitonjob.hunter.Hunter",
        id : 0,
        mail: hunterData.mail,
        phone: hunterData.phone
      }
    };

    let loginString = JSON.stringify(login);
    let encodedLogin = btoa(loginString);
    let dataLog = {
      'class': 'fr.protogen.masterdata.model.CCallout',
      'id': 155,
      'args': [{
        'class': 'fr.protogen.masterdata.model.CCalloutArguments',
        label: 'hunter junior opportunity',
        value: encodedLogin
      }]
    };
    let body = JSON.stringify(dataLog);

    return new Promise(resolve => {
      let headers = new Headers();
      headers.append("Content-Type", 'application/json');
      this.http.post(this.calloutURL, body, {headers: headers})
          .map(res => res.json())
          .subscribe(data => {
            this.remoteData = data;
            resolve(this.remoteData);
          });
    })
  }


  /**
   * @description     loading sector listSectors
   * @return sector listSectors in the format {id : X, libelle : X}
   */
  loadSectors() {
    var sql = 'select pk_user_metier as id, libelle as label from user_metier ORDER BY libelle';
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      let headers = new Headers();
      headers.append("Content-Type", 'text/plain');
      this.http.post(this.sqlURL, sql, {headers: headers})
          .map(res => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            console.log(data);
            this.listSectors = data.data;
            resolve(this.listSectors);
          });
    });
  }


  /**
   * loading jobs listSectors from server
   * @return jobs listSectors in the format {id : X, idsector : X, libelle : X}
   */
  loadJobs(idSector:number) {

    let sql = "";
    if (idSector && idSector > 0)
      sql = 'SELECT pk_user_job as id, user_job.libelle as label, fk_user_metier as idsector, user_metier.libelle as libelleSector  ' +
          'FROM user_job, user_metier ' +
          'WHERE fk_user_metier = pk_user_metier ' +
          'AND fk_user_metier =' + idSector + ' ORDER BY user_job.libelle';
    else
      sql = 'SELECT pk_user_job as id, user_job.libelle as label, fk_user_metier as idsector, user_metier.libelle as labelSector ' +
          'FROM user_job, user_metier ' +
          'WHERE fk_user_metier = pk_user_metier ORDER BY user_job.libelle';

    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      let headers = new Headers();
      headers.append("Content-Type", 'text/plain');
      this.http.post(this.sqlURL, sql, {headers: headers})
          .map(res => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            console.log(data);
            this.listJobs = data.data;
            resolve(this.listJobs);
          });
    });
  }

}

