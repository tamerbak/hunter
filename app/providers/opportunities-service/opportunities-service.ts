import {Storage, SqlStorage} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Configs} from "../../configurations/configs";

@Injectable()
export class OpportunitiesService {
    opportunities:any = null;
    storage:any;
    opportunity:any;
    invitations:any;
    candidates:any = [];
    contact:any;
    invitation:any;

    constructor(public http: Http) {
        this.storage = new Storage(SqlStorage);
    }

    loadInvitationsByAccountId(idAccount){
        let sql = "SELECT " +
            "user_opportunite.pk_user_opportunite AS id, " +
            "user_opportunite.titre AS title, " +
            "user_opportunite.date_de_creation AS date_de_creation, " +
            "user_opportunite.description AS description, " +
            "user_candidature_opportunite.fk_user_account AS my_account, " +
            "user_candidature_opportunite.vue AS seen, " +
            "user_candidature_opportunite.pk_user_candidature_opportunite AS id_candidature, " +
            "user_opportunite.est_active AS active_opp, " +
            "user_account.role AS contact_role, " +
            "user_account.pk_user_account AS contact_origin " +
            "FROM public.user_candidature_opportunite, public.user_opportunite, public.user_account " +
            "WHERE user_candidature_opportunite.fk_user_opportunite = user_opportunite.pk_user_opportunite " +
            "AND user_account.pk_user_account = user_opportunite.fk_user_account " +
            "AND est_active='OUI'" +
            "AND user_candidature_opportunite.fk_user_account = "+idAccount;

        console.log('LOADING INVTIATIONS SQL : '+sql);

        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    this.invitations = [];
                    for(let i = 0 ; i < data.data.length ; i++){
                        let row = data.data[i];
                        let o = {
                            opportunity : {
                                id : row.id,
                                title : row.title,
                                description : row.description,
                                creationDate : this.parseDate(row.date_de_creation),
                            },
                            sender :{
                                id : row.contact_origin,
                                role : row.contact_role,
                                fullName : ''
                            },
                            seen : row.seen == 'OUI',
                            id : row.id_candidature
                        };
                        this.invitations.push(o);
                    }

                    console.log("Loaded invitations : " + JSON.stringify(this.invitations));
                    resolve(this.invitations);
                });
        });
    }

    loadOpportunitiesById(oid){
        let sql = 'SELECT user_opportunite.scan_encode, user_opportunite.est_active, user_opportunite.fin_de_candidature, user_opportunite.latitude, user_opportunite.longitude, ' +
            'user_opportunite.date_de_creation, user_opportunite.description, user_opportunite.titre, user_opportunite.pk_user_opportunite, ' +
            'count(user_candidature_opportunite.pk_user_candidature_opportunite) as count_candidatures ' +
            'FROM public.user_opportunite LEFT JOIN public.user_candidature_opportunite ON user_candidature_opportunite.fk_user_opportunite = user_opportunite.pk_user_opportunite ' +
            'WHERE user_opportunite.pk_user_opportunite='+oid+' ' +
            'group by user_opportunite.fk_user_account, user_opportunite.fk_user_entreprise, user_opportunite.fk_user_offre_entreprise, ' +
            'user_opportunite.longitude, user_opportunite.latitude, user_opportunite.scan_encode, user_opportunite.est_active, ' +
            'user_opportunite.fin_de_candidature, user_opportunite.date_de_creation, user_opportunite.description, user_opportunite.titre, ' +
            'user_opportunite.pk_user_opportunite';
        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    if(data.data){
                        let row = data.data[0];
                        this.opportunity = {
                            id : row.pk_user_opportunite,
                            title : row.titre,
                            description : row.description,
                            candidatesCount : row.count_candidatures,
                            activeOpportunity : row.est_active=='OUI',
                            lat : row.latitude,
                            lng : row.longitude,
                            creationDate : this.parseDate(row.date_de_creation),
                            closureDate : this.parseDate(row.fin_de_candidature),
                            picture : row.scan_encode
                        };
                    }
                    resolve(this.opportunity);
                });
        });
    }

    loadOpportunitiesByAccountId(idAccount){
        let sql = 'SELECT user_opportunite.scan_encode, user_opportunite.est_active, user_opportunite.fin_de_candidature, user_opportunite.latitude, user_opportunite.longitude, ' +
            'user_opportunite.date_de_creation, user_opportunite.description, user_opportunite.titre, user_opportunite.pk_user_opportunite, ' +
            'count(user_candidature_opportunite.pk_user_candidature_opportunite) as count_candidatures ' +
            'FROM public.user_opportunite LEFT JOIN public.user_candidature_opportunite ON user_candidature_opportunite.fk_user_opportunite = user_opportunite.pk_user_opportunite ' +
            'WHERE user_opportunite.fk_user_account='+idAccount+' ' +
            'group by user_opportunite.fk_user_account, user_opportunite.fk_user_entreprise, user_opportunite.fk_user_offre_entreprise, ' +
            'user_opportunite.longitude, user_opportunite.latitude, user_opportunite.scan_encode, user_opportunite.est_active, ' +
            'user_opportunite.fin_de_candidature, user_opportunite.date_de_creation, user_opportunite.description, user_opportunite.titre, ' +
            'user_opportunite.pk_user_opportunite';

        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    this.opportunities = [];
                    for(let i = 0 ; i < data.data.length ; i++){
                        let row = data.data[i];
                        let o = {
                            id : row.pk_user_opportunite,
                            title : row.titre,
                            description : row.description,
                            candidatesCount : row.count_candidatures,
                            activeOpportunity : row.est_active=='OUI',
                            lat : row.latitude,
                            lng : row.longitude,
                            creationDate : this.parseDate(row.date_de_creation),
                            closureDate : this.parseDate(row.fin_de_candidature),
                            picture : row.scan_encode
                        };
                        this.opportunities.push(o);
                    }

                    console.log("Loaded opportunities : " + this.opportunities);
                    resolve(this.opportunities);
                });
        });
    }

    saveOpportunity(o, idAccount){
        if(o.closureDate && o.closureDate.length>0){
            let sql = "insert into user_opportunite (titre, description, date_de_creation, fin_de_candidature, est_active, scan_encode, latitude, longitude, fk_user_account) " +
                " values ('"+o.title+"', '"+o.description+"', '"+this.sqlfyDate(o.creationDate)+"', '"+this.sqlfyDate(o.closureDate)+"', 'OUI', '"+o.picture+"', '"+o.lat+"', '"+o.lng+"', '"+idAccount+"')" +
                " returning pk_user_opportunite";
            console.log('insert opp sql : '+sql);
            return new Promise(resolve => {
                let headers = new Headers();
                headers.append("Content-Type", 'text/plain');
                this.http.post(Configs.sqlURL, sql, {headers:headers})
                    .map(res => res.json())
                    .subscribe(data => {

                        if(data.data){
                            o.id = data.data[0].pk_user_opportunite;
                        }
                        this.opportunity = o;
                        console.log("Opportunity inserted : " + JSON.stringify(this.opportunity));
                        resolve(this.opportunity);
                    });
            });
        } else {
            let sql = "insert into user_opportunite (titre, description, date_de_creation, est_active, scan_encode, latitude, longitude, fk_user_account) " +
                " values ('"+o.title+"', '"+o.description+"', '"+this.sqlfyDate(o.creationDate)+"', 'OUI', '"+o.picture+"', '"+o.lat+"', '"+o.lng+"', '"+idAccount+"')" +
                " returning pk_user_opportunite";
            console.log('insert opp sql : '+sql);
            return new Promise(resolve => {
                let headers = new Headers();
                headers.append("Content-Type", 'text/plain');
                this.http.post(Configs.sqlURL, sql, {headers:headers})
                    .map(res => res.json())
                    .subscribe(data => {
                        if(data.data){
                            o.id = data.data[0].pk_user_opportunite;
                        }
                        this.opportunity = o;
                        console.log("Opportunity inserted : " + JSON.stringify(this.opportunity));
                        resolve(this.opportunity);
                    });
            });
        }

        
    }



    updateOpportunity(o){
        let sql = "";
        if(!o.activeOpportunity && o.closureDate && o.closureDate.length>0)
            sql = "update user_opportunite set titre='"+o.title+"', description='"+o.description+"', fin_de_candidature='"+this.sqlfyDate(o.closureDate)+"', " +
                "est_active='"+(o.activeOpportunity?"OUI":"NON")+"' where pk_user_opportunite="+o.id;
        else
            sql = "update user_opportunite set titre='"+o.title+"', description='"+o.description+"', est_active='"+(o.activeOpportunity?"OUI":"NON")+"' where pk_user_opportunite="+o.id;
        console.log('UPDATE OPPORTUNITY SQL : '+sql);
        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    this.opportunity = o;
                    console.log("Opportunity updated : " + this.opportunity);
                    resolve(this.opportunity);
                });
        });
    }

    loadOpportunityCandidates(opportunity){
        let sql = 'SELECT user_candidature_opportunite.pk_user_candidature_opportunite, user_account.telephone, user_account.email, user_account.device_token, user_candidature_opportunite.conclue, ' +
            'user_candidature_opportunite.date_vue, user_candidature_opportunite.vue, user_jobyer.nom, user_jobyer.prenom, user_jobyer.titre ' +
            'FROM public.user_account, public.user_candidature_opportunite, public.user_jobyer ' +
            'WHERE user_account.pk_user_account = user_candidature_opportunite.fk_user_account ' +
            'AND user_jobyer.fk_user_account = user_account.pk_user_account ' +
            'AND user_candidature_opportunite.fk_user_opportunite='+opportunity.id;
        console.log(sql);
        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    if(data.data){
                        for(let i = 0 ; i < data.data.length ; i++){
                            let row = data.data[i];
                            let c = {
                                id : row.pk_user_candidature_opportunite,
                                tel : row.telephone,
                                email : row.email,
                                deviceToken : row.device_token,
                                concluded : row.conclue,
                                seen : row.vue == 'OUI',
                                seenDate: row.vue == 'OUI'?this.parseDate(row.date_vue):'',
                                firstName : row.prenom == 'null'?'':row.prenom,
                                lastName : row.nom,
                                title : row.titre == 'null'?'':row.titre
                            };
                            this.candidates.push(c);
                        }
                    }
                    resolve(this.candidates);
                });
        });
    }

    addCandidate(contact, opportunity){
        let arg = {
            'class' : 'com.vitonjob.hunter.PhoneContact',
            name : contact.displayName,
            tel : contact.tel,
            email : '',
            oppId : opportunity.id
        };

        let encodedArg = btoa(JSON.stringify(arg));

        let payload = {
            'class': 'fr.protogen.masterdata.model.CCallout',
            id: 143,
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
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    this.contact = data;
                    resolve(this.contact);
                });
        });
    }

    seeInvitation(invitation){
        let date = new Date();
        let sdate = (date.getDay()+1)+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        let sql = "update user_candidature_opportunite set vue = 'OUI', updated='"+this.sqlfyDate(sdate)+"' where pk_user_candidature_opportunite="+invitation.id;

        console.log('UPDATE OPPORTUNITY SQL : '+sql);
        return new Promise(resolve => {
            let headers = new Headers();
            headers.append("Content-Type", 'text/plain');
            this.http.post(Configs.sqlURL, sql, {headers:headers})
                .map(res => res.json())
                .subscribe(data => {
                    this.invitation = invitation;
                    console.log("Invitation updated : " + this.invitation);
                    resolve(this.invitation);
                });
        });
    }

    parseDate(sdate){
        if(sdate.length == 0)
            return '';

        sdate = sdate.split(' ')[0];
        let d = new Date(sdate);

        return d.getDay()+'/'+d.getMonth()+'/'+d.getFullYear();
    }

    sqlfyDate(date){
        return date.split('/')[2]+"-"+date.split('/')[1]+"-"+date.split('/')[0]+" 00:00:00+00";
    }
}

