/**
 * MFP AccessPlayer v.1.0.2
 * http://smartplayer.mfpst.com
 *
 * Copyright MFP Multimedia France Productions
 * Released under GPL 3 licence
 * backgroundImage: "key"
 * Date : 2018-10-16T14:58Z
 */
const md5 = require('md5');

class VimeoBuffer{

    constructor(player){
        this.length = 1;
        this.params = {};
        player.on('progress', (params) => {
            this.params = params;
        });
    }

    start(index){
        return 0;
    }

    end(index){
        return this.params.duration * this.params.percent;
    }

}

class VimeoPlayer{

  constructor(video, options, element){
      this.video     = video;
      this.options   = options;
      this.container = element;
      this.domId   = 'vimeo-player-'+md5(JSON.stringify(options));
      this.currentWidth = 0;
      this.buffered = null;
  }

  init(){
      return new Promise((resolve, reject)=>{
        $.getScript("https://player.vimeo.com/api/player.js")
          .done((script,textStatus) => {
            const playerCode = `<div id="${this.domId}"></div>`;
            const videoContainer = $(this.container).find('.video-container')[0];
            $(videoContainer).html(playerCode);
            const width = $(videoContainer).width();
            const videoPlayer = new Vimeo.Player(this.domId, {
                id: this.video.id,
                width: '100%',
                maxwidth: '100%',
                maxheight: '100%',
                speed: true,
                controls: false,
                width: width,
            });
            if(this.video.startAt!==undefined){
                var time = Math.round(this.video.startAt);
                videoPlayer.setCurrentTime(time);
            }
            setTimeout(()=>{
                let vimeoIframe = $(videoContainer).find('iframe')[0];
                $(vimeoIframe).attr('width','100%');
                this.currentWidth = $(vimeoIframe).width();
            }, 200);

            setInterval(()=>{
                let vimeoIframe = $(videoContainer).find('iframe')[0];
                var width = $(vimeoIframe).width();
                if(width!==this.currentWidth){
                    this.currentWidth = width;
                    let height = width * 0.56;
                    $(vimeoIframe).attr('height', height+'px');
                }
                this.currentWidth = width;
            },300);
            this.buffered = new VimeoBuffer(videoPlayer);
            this.videoPlayer = videoPlayer;
            resolve();
        });
      });
  }

  webkitEnterFullscreen(){
      this.videoPlayer.webkitEnterFullscreen();
  }

  canChangeSpeedRate(){
      return new Promise((resolve, reject)=>{
          this.videoPlayer.getPlaybackRate().then((playbackRate)=>{
              this.videoPlayer.setPlaybackRate(playbackRate).then((ret)=>{
                  resolve(true);
              }).catch((error) => {
                  resolve(false);
              });
          }).catch((error) => {
              resolve(false);
          });
      });
  }

  getPosibleSpeedRates(){
      return new Promise((resolve, reject)=>{
          resolve([0.5,1,1.5,2]);
      });
  }

  on(event, callback){
      /**
      video.on('loadedmetadata', ()=>{
      video.on('play', (e)=>{
      video.on('pause', (e) => {
      video.on('timeupdate', (e)=>{
      video.on('durationchange', (e)=>{
      video.on('progress', (e)=>{
      **/
      if(event==='canplay'){
          return callback();
      }
      return this.videoPlayer.on(event, callback);
  }

  off(event, callback=null){
      if(event==='canplay'){
          return;
      }
      return $(this.videoPlayer).off(event, callback);
  }

  play(){
      return this.videoPlayer.play();
  }

  pause(){
      return this.videoPlayer.pause();
  }

  getDuration(){
      return this.videoPlayer.getDuration();
  }

  getCurrentTime(){
      return this.videoPlayer.getCurrentTime();
  }

  setCurrentTime(time){
      time = Math.round(time);
      this.videoPlayer.setCurrentTime(time);
  }

  getBuffered(){
      return new Promise((resolve, reject) => {
        resolve(this.buffered);
      });
  }

  getTextTracks(){
      return this.videoPlayer.textTracks;
  }

  getCurrentSrc(){
      return new Promise((resolve, reject)=>{
          resolve(this.options.path);
      });
  }

  setSrc(src){
      this.videoPlayer.src = src;
  }

  getPaused(){
      return this.videoPlayer.getPaused();
  }

  setControls(status){
      this.videoPlayer.controls = status;
  }

  setTabIndex(index){
      this.videoPlayer.tabindex = index;
  }

  setPlaybackRate(rate){
      this.videoPlayer.setPlaybackRate(rate);
  }

  getVolume(){
      return this.videoPlayer.getVolume();
  }

  setVolume(volume){
      this.videoPlayer.setVolume(volume);
  }

}

MFP.prototype.loadVideoVimeo = function(videoOps){
    return new Promise((resolve, reject)=>{
      const video = new VimeoPlayer(videoOps, this.options, this.container);
      video.init().then(()=>{
          resolve(video);
      });
    });
};
