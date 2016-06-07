import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Configs} from "../../configurations/configs";

/*
 Generated class for the EmployersService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class EmployersService {
    accounts: any = null;
    opportunity: any;

    constructor(public http: Http) {}

    seekAccounts(query){
        let encodedArg = btoa(query);

        let payload = {
            'class': 'fr.protogen.masterdata.model.CCallout',
            id: 146,
            args: [{
                'class': 'fr.protogen.masterdata.model.CCalloutArguments',
                label: 'Contact to create',
                value: encodedArg
            }]
        };
        return new Promise(resolve => {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.
            let headers = new Headers();
            headers.append("Content-Type", 'application/json');
            this.http.post(Configs.calloutURL, JSON.stringify(payload), {headers: headers})
                .map(res => res.json())
                .subscribe(data => {
                    debugger;
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    this.accounts = data;
                    resolve(this.accounts);
                });
        });
    }

    saveEnterprise(opportunity){
        let sql = "update user_opportunite set fk_user_entreprise="+opportunity.account.idEntreprise+" where pk_user_opportunite="+opportunity.id;
        
        console.log('UPDATE OPPORTUNITY SQL : '+sql);
        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    this.opportunity = opportunity;
                    resolve(this.opportunity);
                });
        });
    }
}

