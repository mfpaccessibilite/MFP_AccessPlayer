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

class VimeoPlayer{

  constructor(video, options, element){
      this.video     = video;
      this.options   = options;
      this.container = element;
      this.domId   = 'vimeo-player-'+md5(JSON.stringify(options));
  }

  init(){
      return new Promise((resolve, reject)=>{
        $.getScript("https://player.vimeo.com/api/player.js")
          .done((script,textStatus) => {
            const playerCode = `<div id="${this.domId}"></div>`;
            const videoContainer = $(this.container).find('.video-container')[0];
            $(videoContainer).html(playerCode);
            const width = $(videoContainer).width();
            this.videoPlayer = new Vimeo.Player(this.domId, {
                id: this.video.id,
                maxwidth: '100%',
                maxheight: 720,
                controls: false,
                width: width
            });
            if(this.video.startAt!==undefined){
                var time = Math.round(this.video.startAt);
                this.videoPlayer.setCurrentTime(time);
            }
            resolve();
        });
      });
  }

  webkitEnterFullscreen(){
      this.videoPlayer.webkitEnterFullscreen();
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
      return this.videoPlayer.buffered;
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
