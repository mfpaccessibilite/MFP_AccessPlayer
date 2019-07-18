Version en français ci-dessous.

# MFP AccessPlayer (English version)

This project is a web video player that complies with the WCAG and RGAA accessibility guidelines and implements the WAI-ARIA specification. It is driven by MFP's determination to adapt France Télévisions's video accessibility requirements to the web.

## Features

### Accessibility features
* Possibility of enabling subtitles in 'SRT', 'WebVTT' and 'STL' (EBU N19) formats (SRT and STL format playback is performed via JavaScript, so be careful with your headers to avoid cross-site scripting issues)
* Support for subtitles without position or color information (SRT), customization of background color, font color, and font type and size
* Button to enable audio description
* Button to enable sign language
* Management of text versions of videos (transcripts) to download in your choice of format

### Other features
* Fluid interface that adapts to different screen sizes (responsive web design), and works even on mobile and tablet devices
* Management of multiple players on a single page
* Button to enable a low-definition alternative video
* Management of playback speed
* Management of chaptering files in 'WebVTT' format
* Possibility of creating an interactive transcript from the selected subtitle file with automatic text highlighting
* Support Vimeo hosted video (a bug in Vimeo API avoid the playback speed with Vimeo)
* Skins supports to customize the player layout (the player come with 3 differents skins, blue, red and green, feel free to make your own and to contribute it)
* Multilinguale (we provide translation in French and English, please contribute to add new translation)
* We provide right now plugins of the player, one for WordPress the other one for ResourceSpace. Today they use old version of the plugin (V 1.0.2). They will be updated soon.

## Browser compatibility

List of browsers for which MFP AccessPlayer video player compatibility has been verified:

* Windows:
    * Firefox 56 and above,
    * Chrome 62.0.3250.0 and above,
    * Opera 49.0.2725.34 and above.
* OS X:
    * Firefox 56 and above,
    * Chrome 58.0.3050.0 and above,
    * Opera 48.0.2685.52 and above,
    * Safari 11 and above.
* Ubuntu:
    * Firefox 56 and above.

## Technical dependencies

List of JavaScript libraries required to run MFP AccessPlayer video player on your webpage :

* JavaScript libraries:
    *  JQuery version 3.1.1
    *  JQuery UI Version 1.12.1
    *  JQuery UI Touch punch

For development we used the following software/librairies
* Icon font generator: [icomoon] (http://icomoon.io)
* Node + npm (list of package can be found in the package.json file)
* WebPack to run a local webserver

To test localy the player, please use npm as CORS restriction won't allow you to use the player directly from any of the demo html page.
To do so run `npm run start` to launch the local web server and use the player in dev mode.
If you want to build the player run `npm run build`. You will find in the dist folder the buid of the player in the MFP folder.

## Contribution

All help is welcome and appreciated! Each and every one can contribute according to their skills:

* If you encounter a bug or have suggestions for improvements, you can create an issue.
* If you code, you must post your contributions in a branch distinct from the Master.
* If you speak several languages, you can help us translate the player and this documentation, which are currently in French and English. See the "Customization and translation" section below.

### Free License
This softare is distributed under the lisense GNU GPL version 3 or later. Please read the file LICENSE.md for more details.

### Software sources

The video player sources are hosted on the [Github repository dedicated to MFP AccessPlayer](https://github.com/mfpaccessibilite/MFP_AccessPlayer), so you can easily contribute to the improvement of the player.

## Installation

The video player depends on JQuery and JQuery UI libraries and for touch support on Smartphone Jquery UI Touch Punch.

Add them as follows in the 'head' of your html page:

```html
<script src="https://code.jquery.com/jquery-3.1.1.js" integrity="sha256-16cdPddA6VdVInumRGo6IbivbERE8p7CQR3HzTBuELA=" crossorigin="anonymous"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/furf/jquery-ui-touch-punch@latest/jquery.ui.touch-punch.min.js"></script>
<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css" type="text/css" />
```

Then add the player:
```html
<script src="MFP/mfp.js"></script>
```

## Use

### Option 1

In the '<video>' tag, just add the following attribute: **`data-mfp`**
You can define the player options in the attribute: **`data-options`**

### Option 2

You can invoke the player with JavaScript:

```javascript
var player = '#myPlayer';
var options = {
	lang: 'fr'
};
new MFP(player,options);
```

## Options list

- `lang`        :   the player's default language is English (en). If this option is not set, the player will try to load a language file for the language set in your **`<html>`** tag; if the translation file does not exist, the default language is English. Simply add translation files in the player's **`lang`** folder
- `videos`      :   in a JS object, you can set the following video variants: low definition, with audio description, with sign language overlay. These variants will be automatically proposed by the player
```javascript
{
    highdef:   'PathToMyHighDefVideo.mp4', 
    lowdef:     'pathToMyLowDefVideo.mp4',
    audiodesc:  'pathToMyAudioDesctiptionVideo.mp4',
    signed:     'PathToMySignedVideo.mp4'
}
```

You can also load a video from youtube, to do so :
```
{
    highdef: {
        src: 'VIMEO-ID',
        type: 'vimeo'
    }
}
```

If you want you can also declare your videos as sources inside the video tag. Keep in mind in case you defin inside the tage and in the options, that the options will be the kepts videos :
```
<video data-mfp>
    <source src="VIMEO-ID" type="video/vimeo" />
    <source src="pathToMyLowDefVideo.mp4" type="video/mp4" format="lowdef" />
    <source src="pathToMyAudioDesctiptionVideo.mp4" type="video/mp4" format="audiodesc" />
    <source src="PathToMySignedVideo.mp4" type="video/mp4" format="signed" />
</video>
```

- `transcript`  :   the player can propose text versions (transcripts) of the videos in html and txt formats, which will open in an external window. You can reference these files in a JS object:
```javascript
{
    html:'pathToMyHTMLTranscript.html',
    txt:'pathToMyTXTTranscript.txt'
}
```
- `live`        :   the player can display the contents of the subtitles in a block outside the video. We call this feature "live transcript". The texts will be highlighted in real time as they are spoken in the video. You can indicate in the `live` option the identifier of the element of your page where the live transcript will be displayed.  #myLiveTranscript`
- `theme_class` : you can add a custom class to the player to customize the layout. See our examples on the DemoPage. You will have to manually load the custom css in your html page.

## Customization and translations

To change the text of the information window, go to the src > infos folder. You can change the contents of the window to the desired language, or create new versions.

To edit an existing translation or add one, go to the src > js > lang folder.

## Conversion of STL files to WebVTT

The scripts contained in the MFP > trackreader folder are used to convert the STL file (used for TV) to an equivalent in WebVTT format. There is nothing to do, the conversion is automatic. It is best to leave these files alone.

## Examples

### Creation with the data option

```html
<video data-mfp data-options="{
    videos:{
        audiodesc:'/videos/video_vo_ad.mp4'
    },
    transcripts:{
        html:'/transcripts/fr.htm',
        txt:'/transcripts/fr.txt'
    },
    live: '#text-target1',
    theme_class: 'blue_theme'
}">
    <source src="/videos/video_vo.mp4" type="video/mp4" />
    <track src="/subtitles/fr.srt" kind="subtitles" label="Français (SRT)" srclang="fr" />
</video>
<div id="text-target1">Live Transcript ici</div>
```

### Creation with JavaScript invocation

```html
<video id="myPlayer">
    <source src="/videos/video_vo.mp4" type="video/mp4" />
    <track src="/subtitles/fr.srt" kind="subtitles" label="Français (SRT)" srclang="fr" />
</video>
<div id="text-target1">Live Transcript ici</div>
<script>
var player = '#myPlayer';
var options = {
    lang: 'fr',
    videos: {
        audiodesc; '/videos/video_vo_ad.mp4'
    },
    transcripts:{
        html:'/transcripts/fr.htm',
        txt:'/transcripts/fr.txt'
    },
    live: 'text-target1',
    theme_class: 'ftva_theme'
};
new MFP(player,options);
</script>
```

### Demo page

[Demo page hosted by France TV Access](https://demovideo.francetvaccess.fr)


## About MFP AccessPlayer

Leader in TV captioning for the deaf and hard of hearing in France, [MFP - subsidiary of the France Télévisions Group] (https://www.facebook.com/MFPTV/), with ISO 9001 standardized processes, has engaged since 2013 in a research and development process: a first video player, awarded the AccessiWeb Silver label, was released early in 2014.

In 2017, [MFP](http://www.mfpaccessibilite.fr/) invented the **MFP AccessPlayer**, the result of a project begun 4 years ago. This multi-accessible, unique and innovative video player, available under free license, allows people with disabilities, be they deaf, hard of hearing, blind or visually impaired, or with motor disabilities, to access the meaning of any type of video content broadcast on the Web.

Beyond disability, the **MFP AccessPlayer** benefits all users around the world whose viewing of videos is impeded or specific: for example, on the move, on mobile or tablet, in noisy environments, in case of limited or failing internet connectivity, in case of a language barrier or difficulty, for offline use, etc.

[MFP’s expertise](http://www.mfpaccessibilite.fr/) in making web video content accessible through subtitling currently responds to the expectations and issues of many customers from the world of education, training, from international groups as well as from public institutions of higher education and research, cultural institutions, associations, and so on.

### Credits

MFP AccessPlayer was developed by Multimedia France Productions with the help of Projektiles and [Koena](https://koena.net/lang/en/index.php).


# MFP AccessPlayer (version en français)

Ce projet est un lecteur vidéo web conforme aux règles d'accessibilité (WCAG, RGAA) et intégrant la spécification WAI-ARIA. Il repose sur la volonté de MFP d'adapter leur exigence d'accessibilité des vidéos pour France Télévisions sur le Web.

## Fonctionnalités

### Fonctionnalités pour l'accessibilité
- Possibilité d'activer les sous-titres dans les formats `SRT`, `WebVTT` et `STL`(format EBU N19) (la lecture en format SRT et STL se fait via javascript, aussi il faudra bien faire attention à vos en-têtes afin de ne pas avoir de problème de cross scripting policie)
- Support pour les sous-titres sans information de placement et couleur (SRT), la personnalisation de la couleur de fond, de la couleur de police et de la taille de police ainsi que du type de police
- Bouton pour activer de l'audiodescription
- Bouton pour activer de la langue des signes
- Gestion des versions textes des vidéos (transcript) à télécharger dans le format de votre choix

### Autres fonctionnalités
- Interface fluide s'adaptant aux différentes tailles d'écran (responsive web design), fonctionnant y compris sur smartphone et tablette
- Gestion de plusieurs lecteurs sur une même page
- Bouton pour activer une vidéo alternative en basse définition
- Gestion de la vitesse de lecture
- Gestion des fichiers de Chapitrage au format `WebVTT`
- Possibilité de création d'un transcript interactif depuis le fichier de sous-titre choisi avec suivi de lecture

## Compatibilité navigateurs

Liste des navigateurs pour lesquels la compatibilité du lecteur vidéo MFP AccessPlayer a été vérifiée :

* Windows :
    * Firefox 56 et +,
    * Chrome 62.0.3250.0 et +,
    * Opéra 49.0.2725.34 et +.
* OS X :
    * Firefox 56 et +,
    * Chrome 58.0.3050.0 et +,
    * Opéra 48.0.2685.52 et +
    * Safari 11 et +.
* Ubuntu :
    * Firefox 56 et +.

## Dépendences techniques

Liste des bibliothèques JavaScript nécessaires au bon fonctionnement du lecteur vidéo MFP AccessPlayer :

* Bibliothèques JavaScript :
    *  JQuery version 3.1.1
    *  JQuery UI Version 1.12
    *  JQuery UI Touch Punch
* Générateur de font icon : [icomoon](http://icomoon.io)
* Pré-processeur CSS : Sass + Compass

## Contribution

Toute aide est bienvenue et appréciée ! Chacune et chacun peut contribuer selon ses compétences :

* Si vous rencontrez un bug ou avez des suggestions d'améliorations, vous pouvez créer une issue.
* Si vous codez, vous devez poster vos contributions sur une branche distincte de Master.
* Si vous parlez plusieurs langues, vous pouvez nous aider à traduire le lecteur et cette documentation qui sont actuellement en français et en anglais. Voir la section ci-dessous "Personnalisation et traduction".

### Licence libre

Ce logiciel est distribué sous la licence GNU GPL version 3 ou ultérieure. Se reporter au fichier LICENSE.md pour les détails.

### Sources du logiciel

Les sources du lecteur vidéo sont hébergées sur le [dépôt Github dédié au lecteur MFP AccessPlayer](https://github.com/mfpaccessibilite/MFP_AccessPlayer), vous pouvez ainsi contribuer facilement à l'amélioration du lecteur.

## Installation

Le lecteur vidéo dépend des bibliothèques JQuery et JQuery UI.

Ajoutez-les comme suit dans le `head` de votre page html :

```html
<script src="https://code.jquery.com/jquery-3.1.1.js" integrity="sha256-16cdPddA6VdVInumRGo6IbivbERE8p7CQR3HzTBuELA=" crossorigin="anonymous"></script>
<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/furf/jquery-ui-touch-punch@latest/jquery.ui.touch-punch.min.js"></script>
<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css" type="text/css" />
```

Puis Ajoutez le lecteur :
```html
<script src="MFP/mfp.js"></script>
```

## Utilisation

### Option 1

Dans la balise `<video>` il vous suffit d'ajouter l'attribut suivant : **`data-mfp`**
Vous pouvez définir les options du lecteur dans l'attribut : **`data-options`**

### Option 2

Vous pouvez invoquer en javascript le lecteur :

```javascript
var player = '#myPlayer';
var options = {
	lang: 'fr'
};
new MFP(player,options);
```

## Liste des options

- `lang`        :   la langue par defaut du lecteur est l'anglais (en). Si cette option n'est pas définie, le lecteur va essayer de charger un fichier de langue de la langue définie dans votre balise **`<html>`** , si le fichier de traduction n'existe pas, la solution par défaut est l'anglais. Vous pouvez simplement ajouter des fichiers de traduction dans le dossier **`lang`** du lecteur
- `videos`      :   dans un objet JS, vous pouvez définir les variantes vidéos suivantes : basse définition, avec audio-description, avec incrustration de la langue des signes. Ces variantes seront automatiquement proposées par le lecteur
```javascript
{
    lowdef:     'pathToMyLowDefVideo.mp4',
    audiodesc:  'pathToMyAudioDesctiptionVideo.mp4',
    signed:     'pathToMySignedVideo.mp4'
}
```
- `transcript`  :   le lecteur peut proposer des versions textes des vidéos (transcriptions) aux formats html et txt, qui s'ouvriront dans une fenêtre extérieure. Vous pouvez référencer ces fichiers dans un objet JS :
```javascript
{
    html:'pathToMyHTMLTranscript.html',
    txt:'pathToMyTXTTranscript.txt'
}
```
- `live`        :   le lecteur peut afficher le contenu des sous-titres dans un bloc en dehors de la vidéo. Nous appelons cette fonctionnalité "live transcript". Les textes seront surlignés en temps réel au moment où ils sont prononcés dans la vidéo. Vous pouvez indiquer au sein de l'option `live` l'identifiant de l'élément de votre page où le live transcript devra être affiché. `#myLiveTranscript`
- `theme_class` :   vous pouvez ajouter une class css de personnalisation au lecteur vidéo. Vous pouvez regarder nos examples dans les pages démo. Il vous faudra charger votre css personnalisé dans votre page HTML.

## Personnalisation et traductions

Pour modifier le texte de la fenêtre d'information, rendez-vous dans le dossier MFP > infos. Vous pouvez modifier le contenu de la fenêtre dans la langue souhaitée, ou créer de nouvelles versions.

Pour modifier une traduction existante ou en ajouter une, allez dans le dossier MFP > lang.

## Conversion des fichiers STL vers Web VTT

Les scripts contenus dans le dossier MFP > trackreader permettent une conversion du fichier STL (utilisé à la télévision) vers un équivalent au format Web VTT. Il n'y a rien à faire, la conversion est automatique. Il vaut mieux éviter de toucher ces fichiers.

## Exemples

### Création avec l'option data

```html
<video data-mfp data-options="{
    videos:{
        audiodesc:'/videos/video_vo_ad.mp4'
    },
    transcripts:{
        html:'/transcripts/fr.htm',
        txt:'/transcripts/fr.txt'
    },
    live: '#text-target1',
    theme_class: 'ftva_theme'
}">
    <source src="/videos/video_vo.mp4" type="video/mp4" />
    <track src="/subtitles/fr.srt" kind="subtitles" label="Français (SRT)" srclang="fr" />
</video>
<div id="text-target1">Live Transcript ici</div>
```

### Creation avec l'invocation javascript

```html
<video id="myPlayer">
    <source src="/videos/video_vo.mp4" type="video/mp4" />
    <track src="/subtitles/fr.srt" kind="subtitles" label="Français (SRT)" srclang="fr" />
</video>
<div id="text-target1">Live Transcript ici</div>
<script>
var player = '#myPlayer';
var options = {
    lang: 'fr',
    videos: {
        audiodesc; '/videos/video_vo_ad.mp4'
    },
    transcripts:{
        html:'/transcripts/fr.htm',
        txt:'/transcripts/fr.txt'
    },
    live: 'text-target1',
    theme_class: 'ftva_theme'
};
new MFP(player,options);
</script>
```

### Page de démonstration

[Page de démo hébergée par France TV Access](https://demovideo.francetvaccess.fr)


## À propos du lecteur MFP AccessPlayer

Leader du sous-titrage TV pour sourds et malentendants en France, [MFP – filiale du groupe France Télévisions](https://www.facebook.com/MFPTV/), aux process normés ISO 9001, est engagé depuis 2013 dans une démarche de recherche et développement : un premier lecteur vidéo, labellisé AccessiWeb Argent a été lancé début 2014.

En 2017, [MFP](http://www.mfpaccessibilite.fr/) invente le **MFP AccessPlayer**, fruit d’un projet initié il y a 4 ans. Ce lecteur vidéo multiaccessible, unique et innovant, disponible sous licence libre, permet aux personnes en situation de handicap, qu’elles soient sourdes, malentendantes, aveugles ou malvoyantes, handicapées moteur, d’accéder au sens de tout type de contenu vidéo diffusé sur le Web.

Au-delà du handicap, le **MFP AccessPlayer** bénéficie à tous les utilisateurs du monde entier dont la consultation de vidéos est entravée ou spécifique : par exemple, en mode nomade sur mobile ou tablette, dans des environnements sonores perturbants, en situation de connectivité internet limitée ou défaillante, en cas de barrière ou de difficulté linguistique, pour un usage offline etc.

L’[expertise MFP](http://www.mfpaccessibilite.fr/) de mise en accessibilité par le sous-titrage des contenus vidéo sur le web répond aujourd’hui aux attentes et problématiques de nombreux clients issus du monde de l’éducation, de la formation, de groupes internationaux comme d’établissements publics d’enseignement supérieur et de recherche, d’institutions culturelles, d’associations…

### Crédits

Le lecteur MFP AccessPlayer a été développé par Multimedia France Productions avec le concours de la société Projektiles et de la société [Koena](https://koena.net).