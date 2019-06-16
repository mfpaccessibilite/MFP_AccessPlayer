/**
 * MFP AccessPlayer v.1.0
 * http://smartplayer.mfpst.com
 * 
 * Extention to READ track in SRT fileformat
 *
 * Copyright MFP Multimedia France Productions
 * Released under GPL 3 licence
 * backgroundImage: "key"
 * Date : 2017-10-19T06:48Z
 */

MFP.prototype.loadTrackTypeSRT=function(player,filepath,track){

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
                    parser.track.readyState=2;
                    function strip(s) {
                        return s.replace(/^\s+|\s+$/g,"");
                    }
                    var data=xhr.response;
                    console.log(data);
                    srt = data.replace(/\r\n|\r|\n/g, '\n');

                    srt = strip(srt);

                    var srt_ = srt.split('\n\n');

                    var cont = 0;
                
                    for(s in srt_) {
                        st = srt_[s].split('\n');

                        if(st.length >=2) {
                            n = st[0];

                            i = strip(st[1].split(' --> ')[0]);
                            o = strip(st[1].split(' --> ')[1]);
                            t = st[2];
                            var tcit = (parseInt(i.substring(0,2))*60*60)+(parseInt(i.substring(3,5))*60)+parseInt(i.substring(6,8))+(parseInt(i.substring(9,12))/1000);
                            var tcot = (parseInt(o.substring(0,2))*60*60)+(parseInt(o.substring(3,5))*60)+parseInt(o.substring(6,8))+(parseInt(o.substring(9,12))/1000);
                            if(st.length > 2) {
                                for(j=3; j<st.length;j++)
                                  t += '\n'+st[j];
                            }
                            var cue = new VTTCue(tcit,tcot,t);
                            cue.id=n;
                            parser.track.track.addCue(cue);

                        }
                        cont++;
                    }
                    parser.player.loadedTrack(parser.track);
                }
            };
            xhr.send(null);
        }
    }
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
