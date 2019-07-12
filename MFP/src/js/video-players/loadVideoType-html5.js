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

    constructor(video, element){
        this.video = video;
        this.container = element;
    }

    destroy(){}

    init(){
        return new Promise((resolve, reject) => {
            if(this.video.fullscreen){
                this.webkitEnterFullscreen();
            }
            let src = this.video.src;
            let mime = this.video.mime;
            const playerCode = `
            <video class="mfp" playsinline tabindex="-1">
                <source src="${src}" type="${mime}" />
            </video>`;
            $(this.container).find('.video-container').html(playerCode);
            this.videoPlayer = $(this.container).find('video')[0];
            resolve();
        });
    }

    canChangeSpeedRate(){
        return new Promise((resolve, reject)=>{
            resolve(true);
        });
    }

    getPosibleSpeedRates(){
        return new Promise((resolve, reject)=>{
            resolve([0.25, 0.5, 1, 1.5, 2]);
        });
    }

    webkitExitFullscreen(){
        this.fullScreen = false;
        $(this.container).removeClass('vimeo-fullscreen');
    }

    webkitEnterFullscreen(){
        $(this.container).addClass('vimeo-fullscreen');
        this.fullScreen = true;
    }

    on(event, callback){
        return $(this.videoPlayer).on(event, callback);
    }

    off(event, callback=null){
        return $(this.videoPlayer).off(event, callback);
    }

    play(){
        return this.videoPlayer.play();
    }

    pause(){
        return this.videoPlayer.pause();
    }

    getDuration(){
        return new Promise((resolve, reject)=>{
            resolve(this.videoPlayer.duration);
        });
    }

    getCurrentTime(){
        return new Promise((resolve, reject)=>{
            resolve(this.videoPlayer.currentTime);
        });
    }

    setCurrentTime(time){
        this.videoPlayer.currentTime = time;
    }

    getBuffered(){
        return new Promise((resolve, reject)=>{
            resolve(this.videoPlayer.buffered);
        });
    }

    getTextTracks(){
        return new Promise((resolve, reject)=>{
          resolve(this.videoPlayer.textTracks);
        });
    }

    getCurrentSrc(){
        return new Promise((resolve, reject)=>{
            resolve(this.videoPlayer.currentSrc);
        });
    }

    setSrc(src){
        this.videoPlayer.src = src;
    }

    getPaused(){
        return new Promise((resolve, reject)=>{
            resolve(this.videoPlayer.paused);
        });
    }

    setControls(status){
        this.videoPlayer.controls = status;
    }

    setTabIndex(index){
        this.videoPlayer.tabindex = index;
    }

    setPlaybackRate(rate){
        this.videoPlayer.playbackRate = rate;
    }

    getVolume(){
        return new Promise((resolve, reject)=>{
            resolve(this.videoPlayer.volume);
        });
    }

    setVolume(volume){
        this.videoPlayer.volume = volume;
    }
}


MFP.prototype.loadVideoHtml5 = function(video){
    return new Promise((resolve, reject) => {
        if(typeof(video)!=='object'){
            video = {
              src: video
            };
        }
        video.fullscreen = this.notSupportedStandarFullScreen;
        const videoPlayer = new VideoHtml5(video, this.container);
        videoPlayer.init().then(()=>{
            resolve(videoPlayer);
        });
    });
};
