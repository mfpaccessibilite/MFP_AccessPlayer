/**
 * MFP AccessPlayer v.1.0.2
 * http://smartplayer.mfpst.com
 *
 * Copyright MFP Multimedia France Productions
 * Released under GPL 3 licence
 * backgroundImage: "key"
 * Date : 2018-10-16T14:58Z
 */
import MFP from './MFP';

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
    var videos = $('video[data-mfp]');
    for(var i=0; i<videos.length; i++){
        var opt = $(videos[i]).data('options');
        if(typeof opt === "undefined"){
            var vid = new MFP($(videos[i]),{});
        }
        else{
        	if(typeof opt !== 'object'){
            	opt = 'opt = '+opt;

                eval(opt);
            }
            var vid = new MFP($(videos[i]),opt);
        }
        vid.init();
    }
}());
