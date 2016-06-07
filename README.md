# VitOnJob

Le projet hunter sur Github ne contient que les parties de développement qui seront modifiées par les différents
collaborateurs du projet.

Les parties manquantes du projet (/node_modules...), vous pouvez les récupérer d'un projet template vide d'Ionic :
`$ ionic start test blank --v2 --ts`

Il faut alors copier les dossiers suivants : nodes_modules - plateforms - plugins
Le dossier www/build sera généré automatiquement lors de votre première execution de `ionic serve`.

## Les composantes natives à installer:

```
$ ionic plugin add cordova-plugin-datepicker
$ ionic plugin add cordova-plugin-network-information
$ ionic plugin add cordova-plugin-geolocation
$ cordova plugin add cordova-plugin-tts
$ cordova plugin add https://github.com/macdonst/SpeechRecognitionPlugin
$ ionic plugin add cordova-plugin-camera
$ cordova plugin add cordova-plugin-camera
$ cordova plugin add cordova-sms-plugin
$ ionic plugin add cordova-plugin-contacts
```

## Environnement

Le projet est compatible avec Ionic la version Beta 8 (non officielle), qui contient 37 sujet d'amélioration. Il ne
reste que 3 pour passer à la version officielle.

Pour faire cette migration Il faut adapter la version courante (Beta 7) en suivant les règles suivantes :

1- Remplacer toutes les instances de `@Page` par `@Component` :

```
import {Page} from 'ionic-angular';

@Page({

})
```
devient :
```
import {Component} from '@angular/core';

@Component({

})
```
2- Dans le fichier app.ts, remplacer `@App` par `@Component`, ajouter la fonction `ionicBootstrap()` et déplacer
les paramètres `config` et `providers` dans cette nouvelle fonction :

```
import {App, Platform} from 'ionic-angular';

@App({
  templateUrl: 'build/app.html',
  providers: [GlobalConfigs, UserService],
  config: {
    backButtonText: 'Retour'
}
export class Hunter {

}
```
devient :
```
import {Component} from '@angular/core';
import {ionicBootstrap, Platform} from 'ionic-angular';

@Component({
  templateUrl: 'build/app.html',
})
export class Hunter {

}

ionicBootstrap(Hunter, [GlobalConfigs, UserService], {
  backButtonText: 'Retour'
});
```
