/**
 * MFP AccessPlayer v.2.0.0
 * http://smartplayer.mfpst.com
 *
 * Copyright MFP Multimedia France Productions
 * Released under GPL 3 licence
 * backgroundImage: "key"
 * Date : 2019-07-18T02:10Z
 */
import MFP from './lib/MFP';

(function(){
    var scriptEls = document.getElementsByTagName('script');
    var thisScriptEl = scriptEls[scriptEls.length - 1];
    var scriptPath = thisScriptEl.src;
    var mfpPath = scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1);
    var MFPDebug = false;

    // including css
    window.mfpPath = mfpPath;
    window.MFP = MFP;
    window.MFPDebug = MFPDebug;

    $('head').append('<link rel="stylesheet" href="'+mfpPath+'stylesheets/screen.css" type="text/css" />');
    var videos = $('*[data-mfp]');
    for(var i=0; i<videos.length; i++){
        var opt = $(videos[i]).data('options');
        var ap = $(videos[i]).attr('autoplay');
        var mu = $(videos[i]).attr('muted');
        if(typeof opt === "undefined"){
            opt = {};
        }
        else{
            if(typeof opt !== 'object'){
                opt = 'opt = '+opt;
                eval(opt);
            }
        }

        if(typeof ap !== "undefined"){
            opt.autoplay=true;
        }
        if(typeof mu!== "undefined"){
            opt.muted=true;
        }
        
        var vid = new MFP($(videos[i]),opt);
        vid.init();
        
    }
}());
