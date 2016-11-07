"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var configs_1 = require("../../configurations/configs");
var OpportunitiesService = (function () {
    function OpportunitiesService(http) {
        this.http = http;
        this.opportunities = null;
        this.candidates = [];
        this.storage = new ionic_angular_1.Storage(ionic_angular_1.SqlStorage);
    }
    OpportunitiesService.prototype.loadInvitationsByAccountId = function (idAccount) {
        var _this = this;
        var sql = "SELECT " +
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
            "AND user_candidature_opportunite.fk_user_account = " + idAccount;
        console.log('LOADING INVTIATIONS SQL : ' + sql);
        return new Promise(function (resolve) {
            var headers = Configs.getHttpTextHeaders();
            _this.http.post(configs_1.Configs.sqlURL, sql, { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.invitations = [];
                for (var i = 0; i < data.data.length; i++) {
                    var row = data.data[i];
                    var o = {
                        opportunity: {
                            id: row.id,
                            title: row.title,
                            description: row.description,
                            creationDate: _this.parseDate(row.date_de_creation)
                        },
                        sender: {
                            id: row.contact_origin,
                            role: row.contact_role,
                            fullName: ''
                        },
                        seen: row.seen == 'OUI',
                        id: row.id_candidature
                    };
                    _this.invitations.push(o);
                }
                console.log("Loaded invitations : " + JSON.stringify(_this.invitations));
                resolve(_this.invitations);
            });
        });
    };
    OpportunitiesService.prototype.loadOpportunitiesById = function (oid) {
        var _this = this;
        var sql = 'SELECT user_opportunite.scan_encode, user_opportunite.est_active, user_opportunite.fin_de_candidature, user_opportunite.latitude, user_opportunite.longitude, ' +
            'user_opportunite.date_de_creation, user_opportunite.description, user_opportunite.titre, user_opportunite.pk_user_opportunite, ' +
            'count(user_candidature_opportunite.pk_user_candidature_opportunite) as count_candidatures ' +
            'FROM public.user_opportunite LEFT JOIN public.user_candidature_opportunite ON user_candidature_opportunite.fk_user_opportunite = user_opportunite.pk_user_opportunite ' +
            'WHERE user_opportunite.pk_user_opportunite=' + oid + ' ' +
            'group by user_opportunite.fk_user_account, user_opportunite.fk_user_entreprise, user_opportunite.fk_user_offre_entreprise, ' +
            'user_opportunite.longitude, user_opportunite.latitude, user_opportunite.scan_encode, user_opportunite.est_active, ' +
            'user_opportunite.fin_de_candidature, user_opportunite.date_de_creation, user_opportunite.description, user_opportunite.titre, ' +
            'user_opportunite.pk_user_opportunite';
        return new Promise(function (resolve) {
            var headers = new http_1.Headers();
            headers.append("Content-Type", 'text/plain');
            _this.http.post(configs_1.Configs.sqlURL, sql, { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                if (data.data) {
                    var row = data.data[0];
                    _this.opportunity = {
                        id: row.pk_user_opportunite,
                        title: row.titre,
                        description: row.description,
                        candidatesCount: row.count_candidatures,
                        activeOpportunity: row.est_active == 'OUI',
                        lat: row.latitude,
                        lng: row.longitude,
                        creationDate: _this.parseDate(row.date_de_creation),
                        closureDate: _this.parseDate(row.fin_de_candidature),
                        picture: row.scan_encode
                    };
                }
                resolve(_this.opportunity);
            });
        });
    };
    OpportunitiesService.prototype.loadOpportunitiesByAccountId = function (idAccount) {
        var _this = this;
        var sql = 'SELECT user_opportunite.scan_encode, user_opportunite.est_active, user_opportunite.fin_de_candidature, user_opportunite.latitude, user_opportunite.longitude, ' +
            'user_opportunite.date_de_creation, user_opportunite.description, user_opportunite.titre, user_opportunite.pk_user_opportunite, ' +
            'count(user_candidature_opportunite.pk_user_candidature_opportunite) as count_candidatures ' +
            'FROM public.user_opportunite LEFT JOIN public.user_candidature_opportunite ON user_candidature_opportunite.fk_user_opportunite = user_opportunite.pk_user_opportunite ' +
            'WHERE user_opportunite.fk_user_account=' + idAccount + ' ' +
            'group by user_opportunite.fk_user_account, user_opportunite.fk_user_entreprise, user_opportunite.fk_user_offre_entreprise, ' +
            'user_opportunite.longitude, user_opportunite.latitude, user_opportunite.scan_encode, user_opportunite.est_active, ' +
            'user_opportunite.fin_de_candidature, user_opportunite.date_de_creation, user_opportunite.description, user_opportunite.titre, ' +
            'user_opportunite.pk_user_opportunite';
        return new Promise(function (resolve) {
            var headers = new http_1.Headers();
            headers.append("Content-Type", 'text/plain');
            _this.http.post(configs_1.Configs.sqlURL, sql, { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.opportunities = [];
                for (var i = 0; i < data.data.length; i++) {
                    var row = data.data[i];
                    var o = {
                        id: row.pk_user_opportunite,
                        title: row.titre,
                        description: row.description,
                        candidatesCount: row.count_candidatures,
                        activeOpportunity: row.est_active == 'OUI',
                        lat: row.latitude,
                        lng: row.longitude,
                        creationDate: _this.parseDate(row.date_de_creation),
                        closureDate: _this.parseDate(row.fin_de_candidature),
                        picture: row.scan_encode
                    };
                    _this.opportunities.push(o);
                }
                console.log("Loaded opportunities : " + _this.opportunities);
                resolve(_this.opportunities);
            });
        });
    };
    OpportunitiesService.prototype.saveOpportunity = function (o, idAccount) {
        var _this = this;
        if (o.closureDate && o.closureDate.length > 0) {
            var sql_1 = "insert into user_opportunite (titre, description, date_de_creation, fin_de_candidature, est_active, scan_encode, latitude, longitude, fk_user_account) " +
                " values ('" + o.title + "', '" + o.description + "', '" + this.sqlfyDate(o.creationDate) + "', '" + this.sqlfyDate(o.closureDate) + "', 'OUI', '" + o.picture + "', '" + o.lat + "', '" + o.lng + "', '" + idAccount + "')" +
                " returning pk_user_opportunite";
            console.log('insert opp sql : ' + sql_1);
            return new Promise(function (resolve) {
                var headers = new http_1.Headers();
                headers.append("Content-Type", 'text/plain');
                _this.http.post(configs_1.Configs.sqlURL, sql_1, { headers: headers })
                    .map(function (res) { return res.json(); })
                    .subscribe(function (data) {
                    if (data.data) {
                        o.id = data.data[0].pk_user_opportunite;
                    }
                    _this.opportunity = o;
                    console.log("Opportunity inserted : " + JSON.stringify(_this.opportunity));
                    resolve(_this.opportunity);
                });
            });
        }
        else {
            var sql_2 = "insert into user_opportunite (titre, description, date_de_creation, est_active, scan_encode, latitude, longitude, fk_user_account) " +
                " values ('" + o.title + "', '" + o.description + "', '" + this.sqlfyDate(o.creationDate) + "', 'OUI', '" + o.picture + "', '" + o.lat + "', '" + o.lng + "', '" + idAccount + "')" +
                " returning pk_user_opportunite";
            console.log('insert opp sql : ' + sql_2);
            return new Promise(function (resolve) {
                var headers = new http_1.Headers();
                headers.append("Content-Type", 'text/plain');
                _this.http.post(configs_1.Configs.sqlURL, sql_2, { headers: headers })
                    .map(function (res) { return res.json(); })
                    .subscribe(function (data) {
                    if (data.data) {
                        o.id = data.data[0].pk_user_opportunite;
                    }
                    _this.opportunity = o;
                    console.log("Opportunity inserted : " + JSON.stringify(_this.opportunity));
                    resolve(_this.opportunity);
                });
            });
        }
    };
    OpportunitiesService.prototype.updateOpportunity = function (o) {
        var _this = this;
        var sql = "";
        if (!o.activeOpportunity && o.closureDate && o.closureDate.length > 0)
            sql = "update user_opportunite set titre='" + o.title + "', description='" + o.description + "', fin_de_candidature='" + this.sqlfyDate(o.closureDate) + "', " +
                "est_active='" + (o.activeOpportunity ? "OUI" : "NON") + "' where pk_user_opportunite=" + o.id;
        else
            sql = "update user_opportunite set titre='" + o.title + "', description='" + o.description + "', est_active='" + (o.activeOpportunity ? "OUI" : "NON") + "' where pk_user_opportunite=" + o.id;
        console.log('UPDATE OPPORTUNITY SQL : ' + sql);
        return new Promise(function (resolve) {
            var headers = new http_1.Headers();
            headers.append("Content-Type", 'text/plain');
            _this.http.post(configs_1.Configs.sqlURL, sql, { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.opportunity = o;
                console.log("Opportunity updated : " + _this.opportunity);
                resolve(_this.opportunity);
            });
        });
    };
    OpportunitiesService.prototype.loadOpportunityCandidates = function (opportunity) {
        var _this = this;
        var sql = 'SELECT user_candidature_opportunite.pk_user_candidature_opportunite, user_account.telephone, user_account.email, user_account.device_token, user_candidature_opportunite.conclue, ' +
            'user_candidature_opportunite.date_vue, user_candidature_opportunite.vue, user_jobyer.nom, user_jobyer.prenom, user_jobyer.titre ' +
            'FROM public.user_account, public.user_candidature_opportunite, public.user_jobyer ' +
            'WHERE user_account.pk_user_account = user_candidature_opportunite.fk_user_account ' +
            'AND user_jobyer.fk_user_account = user_account.pk_user_account ' +
            'AND user_candidature_opportunite.fk_user_opportunite=' + opportunity.id;
        console.log(sql);
        return new Promise(function (resolve) {
            var headers = new http_1.Headers();
            headers.append("Content-Type", 'text/plain');
            _this.http.post(configs_1.Configs.sqlURL, sql, { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                if (data.data) {
                    for (var i = 0; i < data.data.length; i++) {
                        var row = data.data[i];
                        var c = {
                            id: row.pk_user_candidature_opportunite,
                            tel: row.telephone,
                            email: row.email,
                            deviceToken: row.device_token,
                            concluded: row.conclue,
                            seen: row.vue == 'OUI',
                            seenDate: row.vue == 'OUI' ? _this.parseDate(row.date_vue) : '',
                            firstName: row.prenom == 'null' ? '' : row.prenom,
                            lastName: row.nom,
                            title: row.titre == 'null' ? '' : row.titre
                        };
                        _this.candidates.push(c);
                    }
                }
                resolve(_this.candidates);
            });
        });
    };
    OpportunitiesService.prototype.addCandidate = function (contact, opportunity) {
        var _this = this;
        var arg = {
            'class': 'com.vitonjob.hunter.PhoneContact',
            name: contact.displayName,
            tel: contact.tel,
            email: '',
            oppId: opportunity.id
        };
        var encodedArg = btoa(JSON.stringify(arg));
        var payload = {
            'class': 'fr.protogen.masterdata.model.CCallout',
            id: 143,
            args: [{
                    'class': 'fr.protogen.masterdata.model.CCalloutArguments',
                    label: 'Contact to create',
                    value: encodedArg
                }]
        };
        return new Promise(function (resolve) {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.
            var headers = new http_1.Headers();
            headers.append("Content-Type", 'application/json');
            _this.http.post(configs_1.Configs.calloutURL, JSON.stringify(payload), { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                _this.contact = data;
                resolve(_this.contact);
            });
        });
    };
    OpportunitiesService.prototype.seeInvitation = function (invitation) {
        var _this = this;
        var date = new Date();
        var sdate = (date.getDay() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        var sql = "update user_candidature_opportunite set vue = 'OUI', updated='" + this.sqlfyDate(sdate) + "' where pk_user_candidature_opportunite=" + invitation.id;
        console.log('UPDATE OPPORTUNITY SQL : ' + sql);
        return new Promise(function (resolve) {
            var headers = new http_1.Headers();
            headers.append("Content-Type", 'text/plain');
            _this.http.post(configs_1.Configs.sqlURL, sql, { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.invitation = invitation;
                console.log("Invitation updated : " + _this.invitation);
                resolve(_this.invitation);
            });
        });
    };
    OpportunitiesService.prototype.parseDate = function (sdate) {
        if (sdate.length == 0)
            return '';
        sdate = sdate.split(' ')[0];
        var d = new Date(sdate);
        return d.getDay() + '/' + d.getMonth() + '/' + d.getFullYear();
    };
    OpportunitiesService.prototype.sqlfyDate = function (date) {
        return date.split('/')[2] + "-" + date.split('/')[1] + "-" + date.split('/')[0] + " 00:00:00+00";
    };
    OpportunitiesService = __decorate([
        core_1.Injectable()
    ], OpportunitiesService);
    return OpportunitiesService;
}());
exports.OpportunitiesService = OpportunitiesService;
//# sourceMappingURL=opportunities-service.js.map