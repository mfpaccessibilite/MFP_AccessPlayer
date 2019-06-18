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

  constructor(options, element){
      this.options = options;
      this.element = element;
      this.domId   = 'vimeo-player-'+md5(JSON.stringify(options));
  }

  init(){
      return new Promise((resolve, reject)=>{
        $.getScript("https://player.vimeo.com/api/player.js")
          .done((script,textStatus) => {
            const playerCode = `<div id="${this.domId}"></div>`;
            $(this.element).html(playerCode);
            this.video = new Vimeo.Player(this.domId, {
                id: this.options.path,
                maxheight: 720,
                controls: false
            });
            resolve();
        });
      });
  }

  webkitEnterFullscreen(){
      this.video.webkitEnterFullscreen();
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

      return this.video.on(event, callback);
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
      return this.video.getDuration();
  }

  getCurrentTime(){
      return this.video.getCurrentTime();
  }

  setCurrentTime(time){
      time = Math.round(time);
      this.video.setCurrentTime(time);
  }

  getBuffered(){
      return this.video.buffered;
  }

  getTextTracks(){
      return this.video.textTracks;
  }

  getCurrentSrc(){
      return new Promise((resolve, reject)=>{
          resolve(this.options.path);
      });
  }

  setSrc(src){
      this.video.src = src;
  }

  getPaused(){
      return this.video.getPaused();
  }

  setControls(status){
      this.video.controls = status;
  }

  setTabIndex(index){
      this.video.tabindex = index;
  }

  setPlaybackRate(rate){
      this.video.setPlaybackRate(rate);
  }

  getVolume(){
      return this.video.getVolume();
  }

  setVolume(volume){
      console.log(volume);
      this.video.setVolume(volume);
  }

}

MFP.prototype.loadVideoVimeo = function(){
    return new Promise((resolve, reject)=>{
      const video = new VimeoPlayer(this.options, this.element);
      video.init().then(()=>{
          resolve(video);
      });
    });
};
