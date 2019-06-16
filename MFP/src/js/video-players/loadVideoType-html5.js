/**
 * MFP AccessPlayer v.1.0.2
 * http://smartplayer.mfpst.com
 *
 * Copyright MFP Multimedia France Productions
 * Released under GPL 3 licence
 * backgroundImage: "key"
 * Date : 2018-10-16T14:58Z
 */
 
class VideoHtml5{

    constructor(options, video){
        this.options = options;
        this.video   = video;
    }

    init(){}

    webkitEnterFullscreen(){
        this.video.webkitEnterFullscreen();
    }

    on(event, callback){
        return $(this.video).on(event, callback);
    }

    off(event, callback=null){
        return $(this.video).off(event, callback);
    }

    play(){
        return this.video.play();
    }

    pause(){
        return this.video.pause();
    }

    getDuration(){
        return new Promise((resolve, reject)=>{
            resolve(this.video.duration);
        });
    }

    getCurrentTime(){
        return new Promise((resolve, reject)=>{
            resolve(this.video.currentTime);
        });
    }

    setCurrentTime(time){
        this.video.currentTime = time;
    }

    getBuffered(){
        return new Promise((resolve, reject)=>{
            resolve(this.video.buffered);
        });
    }

    getTextTracks(){
        return new Promise((resolve, reject)=>{
          resolve(this.video.textTracks);
        });
    }

    getCurrentSrc(){
        return new Promise((resolve, reject)=>{
            resolve(this.video.currentSrc);
        });
    }

    setSrc(src){
        this.video.src = src;
    }

    getPaused(){
        return new Promise((resolve, reject)=>{
            resolve(this.video.paused);
        });
    }

    setControls(status){
        this.video.controls = status;
    }

    setTabIndex(index){
        this.video.tabindex = index;
    }

    setPlaybackRate(rate){
        this.video.playbackRate = rate;
    }

    getVolume(){
        return new Promise((resolve, reject)=>{
            resolve(this.video.volume);
        });
    }

    setVolume(volume){
        this.video.volume = volume;
    }
}


MFP.prototype.loadVideoHtml5 = function(){
    return new Promise((resolve, reject) => {
        let videoElement = $(this.element)[0];
        const video = new VideoHtml5(this.options, videoElement);
        resolve(video);
    });
};
