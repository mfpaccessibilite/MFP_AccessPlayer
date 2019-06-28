/**
 * MFP AccessPlayer v.1.0.2
 * http://smartplayer.mfpst.com
 *
 * Copyright MFP Multimedia France Productions
 * Released under GPL 3 licence
 * backgroundImage: "key"
 * Date : 2018-10-16T14:58Z
 */

class VideoError{

    constructor(video, options, element){
        this.video = video;
        this.options   = options;
        this.container = element;
        this.volume = 1;
        this.currentTime = 0;
        this.duration = 0;
    }

    destroy(){}

    init(){
        return new Promise((resolve, reject) => {
            const videoContainer = $(this.container).find('.video-container')[0];
            const currentHeight = $(videoContainer).height();
            const msgPadding = currentHeight/3;
            console.log(this.video.msg);
            const tpl = `
              <div style="width:100%;height:${currentHeight}px;background-color:#000;color:#fff">
                  <h2 style="margin:0 auto; padding-top:${msgPadding}px;text-align:center;widh:100%;color:#fff;font-size:21px;">${this.video.msg}</h2>
              </div>
            `;
            $(videoContainer).html(tpl);
            resolve();
        });
    }

    canChangeSpeedRate(){
        return new Promise((resolve, reject)=>{
            resolve(false);
        });
    }

    getPosibleSpeedRates(){
        return new Promise((resolve, reject)=>{
            resolve([]);
        });
    }

    webkitEnterFullscreen(){
        return false;
    }

    on(event, callback){
        return callback();
    }

    off(event, callback=null){
        return false;
    }

    play(){
        return false;
    }

    pause(){
        return false;
    }

    getDuration(){
        return new Promise((resolve, reject)=>{
            resolve(this.duration);
        });
    }

    getCurrentTime(){
        return new Promise((resolve, reject)=>{
            resolve(this.currentTime);
        });
    }

    setCurrentTime(time){
        this.currentTime = time;
    }

    getBuffered(){
        return new Promise((resolve, reject)=>{
            resolve(this.buffered);
        });
    }

    getTextTracks(){
        return new Promise((resolve, reject)=>{
          resolve(this.textTracks);
        });
    }

    getCurrentSrc(){
        return new Promise((resolve, reject)=>{
            resolve(this.currentSrc);
        });
    }

    setSrc(src){
        this.src = src;
    }

    getPaused(){
        return new Promise((resolve, reject)=>{
            resolve(this.paused);
        });
    }

    setControls(status){
        this.controls = status;
    }

    setTabIndex(index){
        this.tabindex = index;
    }

    setPlaybackRate(rate){
        this.playbackRate = rate;
    }

    getVolume(){
        return new Promise((resolve, reject)=>{
            resolve(this.volume);
        });
    }

    setVolume(volume){
        this.volume = volume;
    }
}


MFP.prototype.loadVideoError = function(video){
    return new Promise((resolve, reject) => {
        const videoPlayer = new VideoError(video, this.options, this.container);
        videoPlayer.init().then(()=>{
            resolve(videoPlayer);
        });
    });
};
