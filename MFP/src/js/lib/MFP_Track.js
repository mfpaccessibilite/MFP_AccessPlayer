const md5 = require('md5');
import MFP_Cue from './MFP_Cue';

export default class MFP_Track{

    constructor(track){
        this.trackElement = track;
        this.trackElement.track.mode = 'hidden';
        track = track.track;
        this.cues = [];
        this.activeCues = [];
        this.mode = track.mode;
        this.kind = track.kind;
        this.subid = track.subid;
        this.label = track.label;
        this.language = track.language;
        this.src = $(this.trackElement).attr('src');
        var filename = this.src;
        this.ext = filename.split('.').pop().toLowerCase();
        this.eventListeners = [];
    }

    on(eventName, callback){
        let random = Date.now() + '-' + Math.random()+'-'+Math.random();
        let id = md5(random);
        this.eventListeners.push({
            eventName,
            callback,
            id
        });
    }

    off(id){
        let aux = [];
        for(let eventListener in this.eventListeners){
            if(eventListener.id!==id){
              aux.push(eventListener);
            }
        }
        this.eventListeners = aux;
        return true;
    }

    dispatchEvent(eventName, params){
        for(let eventListener of this.eventListeners){
            if(eventListener.eventName===eventName){
                eventListener.callback(params);
            }
        }
    }

    load(){
        if(this.ext!=='vtt'){
            this.dispatchEvent('error', this);
        }else{
            if(this.trackElement.readyState==2){
              this.loadCues();
            }else if(this.trackElement.readyState==3){
              this.dispatchEvent('error', this);
            }else{
              this.trackElement.addEventListener('load', this.loadCues.bind(this));
              this.trackElement.addEventListener('error', ()=>{
                  this.dispatchEvent('error', this);
              });
            }
        }
    }

    loadCues(){
        let trackCues = this.trackElement.track.cues;
        for(let trackCue of trackCues){
            let cue = new MFP_Cue(trackCue.startTime, trackCue.endTime, trackCue.text);
            cue.setTrack(this);
            this.cues.push(cue);
        }
        this.dispatchEvent('load', this);
    }

    addCue(cue){
        cue.setTrack(this);
        this.cues.push(cue);
    }

    activeCues(){

    }

    setVideoPlayer(player){
        this.player = player;
        this.player.on('timeupdate', (e) => {
            this.check();
        });
    }

    check(){
        if(this.mode2==='showing'){
            this.player.getCurrentTime().then((currentTime)=>{
                for(let cue of this.cues){
                    cue.check(currentTime);
                }
            });
        }
        return;
    }

    bindEvents(){
        this.player.on('progress', (time)=>{
            this.check(time);
        });
    }

}
