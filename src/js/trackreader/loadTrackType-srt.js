/**
 * MFP AccessPlayer v.2.0.0
 * http://smartplayer.mfpst.com
 *
 * Copyright MFP Multimedia France Productions
 * Released under GPL 3 licence
 * backgroundImage: "key"
 * Date : 2019-07-18T02:10Z
 */
 
import MFP_Cue from '../lib/MFP_Cue';

MFP.prototype.loadTrackTypeSRT=function(player, filepath, track){

    var parser={
        player:null,
        track:null,
        render:function(filepath){
            var parser = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', filepath, true);
            xhr.responseType = 'string';
            xhr.onload = function(e) {
                if (xhr.status != 200) {
                    // error loading:
                    parser.track.mode=disabled;
                    parser.player.subtitles.splice($(parser.track).data('pos'),1);
                    parser.player.initSubtitlesMenu();
                }
                else{
                    parser.track.mode='hidden';
                    //parser.track.readyState=2;
                    function strip(s) {
                        return s.replace(/^\s+|\s+$/g,"");
                    }
                    var data=xhr.response;
                    var srt = data.replace(/\r\n|\r|\n/g, '\n');

                    srt = strip(srt);

                    var srt_ = srt.split('\n\n');

                    var cont = 0;

                    for(let s in srt_) {
                        let st = srt_[s].split('\n');

                        if(st.length >=2) {
                            let n = st[0];

                            let i = strip(st[1].split(' --> ')[0]);
                            let o = strip(st[1].split(' --> ')[1]);
                            let t = st[2];
                            var tcit = (parseInt(i.substring(0,2))*60*60)+(parseInt(i.substring(3,5))*60)+parseInt(i.substring(6,8))+(parseInt(i.substring(9,12))/1000);
                            var tcot = (parseInt(o.substring(0,2))*60*60)+(parseInt(o.substring(3,5))*60)+parseInt(o.substring(6,8))+(parseInt(o.substring(9,12))/1000);
                            if(st.length > 2) {
                                for(let j=3; j<st.length;j++){
                                  t += '\n'+st[j];
                                }
                            }
                            var cue = new MFP_Cue(tcit,tcot,t);
                            cue.id=n;
                            parser.track.addCue(cue);

                        }
                        cont++;
                    }
                    parser.player.loadedTrack(parser.track);
                }
            };
            xhr.send(null);
        }
    };
    parser.player=player;
    parser.track=track;
    parser.render(filepath);
    if(MFPDebug){
	    console.log('Trying to load '+filepath+' with FileTrack Loader .srt');
	}
};
if(MFPDebug){
	console.log('SRT reader added');
}
