Version en français ci-dessous.

# MFP AccessPlayer (English version) Version 2 with Vimeo Support

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
The player javascript instance is then attached on the created div with class **`mfpaccessplayer`** in the dom element **`data-player`** can be access with jQuery like this `var player = $('.mfpaccessplayer').data('player');`

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
    highdef:    'PathToMyHighDefVideo.mp4',
    lowdef:     'pathToMyLowDefVideo.mp4',
    audiodesc:  'pathToMyAudioDesctiptionVideo.mp4',
    signed:     'PathToMySignedVideo.mp4'
}
```

You can also load a video from Vimeo, to do so :
```
{
    highdef: {
        src: 'VIMEO-ID',
        type: 'vimeo'
    }
}
```

If you want you can also declare your videos as sources inside the video tag. Keep in mind in case you define inside the tag and in the options, that the options will be the kepts videos :
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
- `live`        : the player can display the contents of the subtitles in a block outside the video. We call this feature "live transcript". The texts will be highlighted in real time as they are spoken in the video. You can indicate in the `live` option the identifier of the element of your page where the live transcript will be displayed.  #myLiveTranscript`
- `live_show`   : can be set to true or falsa, default is false. If set to true then transcript live will be displayed at loading. Default live transcript is first one otherwise the last track with data-live set to true.
- `st_show`     : can be set to true or false, default is false. If set to true then subtitle are displayed on top of the video. Default subtiltle is first one otherwise the last track with data-st set to true.
- `start_ts`    : define the start time of the video in seconds. Default is 0.
- `autoplay`    : can be set to true or false, default is false. If set to true then the video will start player on loading. Please note that some Browser can block this behavior. If autoplay is set to true, the video will be automaticaly muted so taht browser don't block the video.
- `muted`       : can be set to true or false, default is false. If set to true, then the video will be muted at loading. This can help to unblock autoplay on some browser. 
- `sound`       : Can be set between 0 and 100 to set sound level at loading. I video is also muted, it will be the default level the video will go back when clicking the unmute button.
- `theme_class` : you can add a custom class to the player to customize the layout. See our examples on the DemoPage. You will have to manually load the custom css in your html page.

## Methods

You can call methods on the player by calling the function on the Player object:

```js
player.play();
```

All methods, except for `on()` and `off()` return a
[Promise](http://www.html5rocks.com/en/tutorials/es6/promises/). The Promise may
or may not resolve with a value, depending on the specific method.

```js
player.play().then(function() {
    // the player play the video
}).catch(function(error) {
    // an error occurred
});
```

Promises for getters are resolved with the value of the property:

```js
player.getBuffered().then(function(loop) {
    // Get the buffered time ranges of the video.
});
```

Promises for setters are resolved with the value set, or rejected with an error
if the set fails. For example:

```js
player.setCurrentTime(23.5).then(function(color) {
    // the currentTime was set
}).catch(function(error) {
    // an error occurred setting the currentTime
});
```

### on(event: string, callback: function): void

Add an event listener for the specified event. Will call the callback with a
single parameter, `data`, that contains the data for that event. See
[events](#events) below for details.

```js
var onPlay = function(data) {
    // data is an object containing properties specific to that event
};

player.on('play', onPlay);
```

### off(event: string, callback?: function): void

Remove an event listener for the specified event. Will remove all listeners for
that event if a `callback` isn’t passed, or only that specific callback if it is
passed.

```js
var onPlay = function(data) {
    // data is an object containing properties specific to that event
};

player.on('play', onPlay);

// If later on you decide that you don’t need to listen for play anymore.
player.off('play', onPlay);

// Alternatively, `off` can be called with just the event name to remove all
// listeners.
player.off('play');
```


### pause(): Promise&lt;void, Error&gt;

Pause the video if it’s playing.

```js
player.pause().then(function() {
    // the video was paused
}).catch(function(error) {
   // an error occurred
});
```

### play(): Promise&lt;void, Error&gt;

Play the video if it’s paused. **Note:** on iOS and some other mobile devices,
you cannot programmatically trigger play. Once the viewer has tapped on the play
button in the player, however, you will be able to use this function.

```js
player.play().then(function() {
    // the video was played
}).catch(function(error) {
    // an error occurred
});
```

### getBuffered(): Promise&lt;array, Error&gt;

Get the buffered time ranges of the video.

```js
player.getBuffered().then(function(buffered) {
    // buffered = an array of the buffered video time ranges.
}).catch(function(error) {
    // an error occurred
});
```

### getCurrentTime(): Promise&lt;number, Error&gt;

Get the current playback position in seconds.

```js
player.getCurrentTime().then(function(seconds) {
    // seconds = the current playback position
}).catch(function(error) {
    // an error occurred
});
```

### setCurrentTime(seconds: number): Promise&lt;number, (RangeError|Error)&gt;

Set the current playback position in seconds. Once playback has started, if the
player was paused, it will remain paused. Likewise, if the player was playing,
it will resume playing once the video has buffered. Setting the current time
before playback has started will cause playback to start.

You can provide an accurate time and the player will attempt to seek to as close
to that time as possible. The exact time will be the fulfilled value of the
promise.

```js
player.setCurrentTime(30.456).then(function(seconds) {
    // seconds = the actual time that the player seeked to
}).catch(function(error) {
    switch (error.name) {
        case 'RangeError':
            // the time was less than 0 or greater than the video’s duration
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### getDuration(): Promise&lt;number, Error&gt;

Get the duration of the video in seconds. It will be rounded to the nearest
second before playback begins, and to the nearest thousandth of a second after
playback begins.

```js
player.getDuration().then(function(duration) {
    // duration = the duration of the video in seconds
}).catch(function(error) {
    // an error occurred
});
```

### getPaused(): Promise&lt;boolean, Error&gt;

Get the paused state of the player.

```js
player.getPaused().then(function(paused) {
    // paused = whether or not the player is paused
}).catch(function(error) {
    // an error occurred
});
```

### getPlaybackRate(): Promise&lt;number, Error&gt;

Get the playback rate of the player on a scale from `0.5` to `2`.

```js
player.getPlaybackRate().then(function(playbackRate) {
    // playbackRate = a numeric value of the current playback rate
}).catch(function(error) {
    // an error occurred
});
```

### setPlaybackRate(playbackRate: number): Promise&lt;number, (RangeError|Error)&gt;

Set the playback rate of the player on a scale from `0.5` to `2` (available to PRO and Business accounts). When set
via the API, the playback rate will not be synchronized to other
players or stored as the viewer's preference.

```js
player.setPlaybackRate(0.5).then(function(playbackRate) {
    // playback rate was set
}).catch(function(error) {
    switch (error.name) {
        case 'RangeError':
            // the playback rate was less than 0.5 or greater than 2
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### getVolume(): Promise&lt;number, Error&gt;

Get the current volume level of the player on a scale from `0` to `1`.

Most mobile devices do not support an independent volume from the system volume.
In those cases, this method will always return `1`.

```js
player.getVolume().then(function(volume) {
    // volume = the volume level of the player
}).catch(function(error) {
    // an error occurred
});
```

### setVolume(volume: number): Promise&lt;number, (RangeError|Error)&gt;

Set the volume of the player on a scale from `0` to `1`. When set via the API,
the volume level will not be synchronized to other players or stored as the
viewer’s preference.

Most mobile devices (including iOS and Android) do not support setting the
volume because the volume is controlled at the system level. An error will *not*
be triggered in that situation.

```js
player.setVolume(0.5).then(function(volume) {
    // volume was set
}).catch(function(error) {
    switch (error.name) {
        case 'RangeError':
            // the volume was less than 0 or greater than 1
            break;

        default:
            // some other error occurred
            break;
    }
});
```

### getLive(): Promise&lt;bool, Error&gt;

Get the current transcript live status of the player, `true` for active and `false` for inactive.

```js
player.getLive().then(function(show) {
    // show = true | false, true for show
}).catch(function(error) {
    // an error occurred
});
```

### setLive(show: bool): Promise&lt;bool, Error&gt;

Set the live transcript on or off.

```js
player.setLive(true).then(function(show) {
    // live transcript was set
}).catch(function(error) {
    
    // an error occurred
});
```

### getLiveTrack(): Promise&lt;number, Error&gt;

Get the current transcript live track number.

```js
player.getLiveTrack().then(function(track) {
    // track = active live transcript track
}).catch(function(error) {
    // an error occurred
});
```

### setLiveTrack(track: number): Promise&lt;number, Error&gt;

Set the live transcript track

```js
player.setLiveTrack(track).then(function(track) {
    // live transcript track was set
}).catch(function(error) {
    
    // an error occurred
});
```

### getSt(): Promise&lt;bool, Error&gt;

Get the current subtitles status of the player, `true` for active and `false` for inactive.

```js
player.getSt().then(function(show) {
    // show = true | false, true for show
}).catch(function(error) {
    // an error occurred
});
```

### setSt(show: bool): Promise&lt;bool, Error&gt;

Set the subtitles on or off.

```js
player.setSt(true).then(function(show) {
    // subtitles was set
}).catch(function(error) {
    
    // an error occurred
});
```

### getStTrack(): Promise&lt;number, Error&gt;

Get the current subtitles track number.

```js
player.getStTrack().then(function(track) {
    // track = active suvbtitles track
}).catch(function(error) {
    // an error occurred
});
```

### setStTrack(track: number): Promise&lt;number, Error&gt;

Set the subtitles track

```js
player.setStTrack(track).then(function(track) {
    // subtitles track was set
}).catch(function(error) {
    
    // an error occurred
});
```

### getVideo(): Promise&lt;string, Error&gt;

Get the current video type, can be hd|ld|audiodesc|signed.

```js
player.getVideo().then(function(video) {
    // video = Current video on screen
}).catch(function(error) {
    // an error occurred
});
```

### setSVideo: string): Promise&lt;string, Error&gt;

Set the current video on screen

```js
player.setVideo(video).then(function(video) {
    // video on screen been change to the given one
}).catch(function(error) {
    
    // an error occurred
});
```



## Events

You can listen for events in the player by attaching a callback using `.on()`:

```js
player.on('eventName', function(data) {
    // data is an object containing properties specific to that event
});
```

The events are equivalent to the HTML5 video events 

To remove a listener, call `.off()` with the callback function:

```js
var callback = function() {};

player.off('eventName', callback);
```

If you pass only an event name, all listeners for that event will be removed.

### play

Triggered when the video plays.

```js
{
    duration: 61.857
    percent: 0
    seconds: 0
}
```

### pause

Triggered when the video pauses.

```js
{
    duration: 61.857
    percent: 0
    seconds: 0
}
```

### ended

Triggered any time the video playback reaches the end. *Note:* when loop is
turned on, the `ended` event will not fire.

```js
{
    duration: 61.857
    percent: 1
    seconds: 61.857
}
```

### timeupdate

Triggered as the `currentTime` of the video updates. It generally fires every
250ms, but it may vary depending on the browser.

```js
{
    duration: 61.857
    percent: 0.049
    seconds: 3.034
}
```

### progress

Triggered as the video is loaded. Reports back the amount of the video that has
been buffered.

```js
{
    duration: 61.857
    percent: 0.502
    seconds: 31.052
}
```

### seeking

Triggered when the player starts seeking to a specific time. A `timeupdate` event will
also be fired at the same time.

```js
{
    duration: 61.857
    percent: 0.485
    seconds: 30
}
```

### seeked

Triggered when the player seeks to a specific time. A `timeupdate` event will
also be fired at the same time.

```js
{
    duration: 61.857
    percent: 0.485
    seconds: 30
}
```

### volumechange

Triggered when the volume in the player changes. Some devices do not support
setting the volume of the video independently from the system volume, so this
event will never fire on those devices.

```js
{
    volume: 0.5
}
```

### playbackratechange

Triggered when the playback rate of the video in the player changes. The ability to change rate can be disabled by the creator
and the event will not fire for those videos. The new playback rate is returned with the event.

```js
{
    playbackRate: 1.5
}
```

### bufferstart

Triggered when buffering starts in the player. This is also triggered during preload and while seeking. There is no associated data with this event.


### bufferend

Triggered when buffering ends in the player. This is also triggered at the end of preload and seeking. There is no associated data with this event.


### loaded

Triggered when a new video is loaded in the player.

```js
{
    id: 76979871
}
```

### durationchange
Triggered when the duration attribute has been updated.

```js
{
    duration: 60
}
```



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
    live_show: true,
    start_ts: 10.45,
    theme_class: 'blue_theme'
}">
    <source src="/videos/video_vo.mp4" type="video/mp4" />
    <track src="/subtitles/fr.srt" kind="subtitles" label="Français (SRT)" srclang="fr" data-live="true" data-st="true" />
</video>
<div id="text-target1">Live Transcript ici</div>
```


### Creation with JavaScript invocation

```html
<video id="myPlayer">
    <source src="/videos/video_vo.mp4" type="video/mp4" />
    <track src="/subtitles/fr.srt" kind="subtitles" label="Français (SRT)" srclang="fr" data-live="true" data-st="true" />
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
    live_show: true,
    start_ts: 10.45,
    theme_class: 'blue_theme'
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


# MFP AccessPlayer (version en français) Version 2 avec support de Vimeo

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
- Support de vidéos hébergées sur la plateforme Vimeo (un bug dans l'API de Vimeo bloque la possibilité de choisir la vitesse de lecture avec Vimeo)
- Support de thèmes (skins) pour le lecteur vidéo (nous fournissons le lecteur avec 3 thèmes, bleu, rouge et vert. Vous pouvez créer vos propres thème et vous pouvez contribuer au projet en les partageant)
- Multilingue (nous fournissons des traductions en Français et Anglais, merci de contribuer afin d'ajouter de nouvelles langues)

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

Pour le developement, nous utilisons les logiciels/librairies suivantes :
* Générateur de font icon : [icomoon](http://icomoon.io)
* Node + npm (la liste des paquets utilisés peut e^tre trouvé dans le fichier package.json)
* WebPack pour lancer un serveur web local.

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
    highdef:   'PathToMyHighDefVideo.mp4',
    lowdef:     'pathToMyLowDefVideo.mp4',
    audiodesc:  'pathToMyAudioDesctiptionVideo.mp4',
    signed:     'pathToMySignedVideo.mp4'
}
```

Vous pouvez aussi charger des vidéos depuis Vimeo :
```javascript
{
    highdef: {
        src: 'VIMEO-ID',
        type: 'vimeo'
    }
}
```
Si vous le souhaitez vous pouvez aussi déclarer directement les videos comme source dans le tag video. Gardez bien en mémoire que si vous utilisez conjointement la déclaration dans le tag video et via options que la déclaration options sera prioritaire.
```html
<video data-mfp>
    <source src="VIMEO-ID" type="video/vimeo" />
    <source src="pathToMyLowDefVideo.mp4" type="video/mp4" format="lowdef" />
    <source src="pathToMyAudioDesctiptionVideo.mp4" type="video/mp4" format="audiodesc" />
    <source src="PathToMySignedVideo.mp4" type="video/mp4" format="signed" />
</video>
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
    theme_class: 'blue_theme'
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
    theme_class: 'blue_theme'
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