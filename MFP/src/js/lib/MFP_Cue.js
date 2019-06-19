const md5 = require('md5');

export default class MFP_Cue{

    constructor(startTime, endTime, text){
        let random = Date.now() + '-' + Math.random()+'-'+ Math.random();
        this.id = md5(random);
        this.track = null;
        this.eventListeners = [];
        this.startTime = startTime;
        this.endTime = endTime;
        this.text = text;
        this.showing = false;
        this.cue = new VTTCue(startTime, endTime, text);
        this.align = this.cue.align;
        this.line  = this.cue.line;
        this.size  = this.cue.size;
    }

    setTrack(track){
        this.track = track;
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

    getCueAsHTML(){
        return this.cue.getCueAsHTML();
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

    check(currentTime){
        if((currentTime<this.startTime) || (currentTime>this.endTime)){
            if(this.showing){
                this.dispatchEvent('exit', this);
                this.showing = false;
            }
        }else{
          if(!this.showing){
              this.dispatchEvent('enter', this);
              this.showing = true;
          }
        }
    }

}
