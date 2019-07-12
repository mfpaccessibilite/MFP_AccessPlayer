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

  constructor(video, element){
      this.video     = video;
      this.container = element;
      this.domId   = 'vimeo-player-'+md5(JSON.stringify(video) + Date.now() + Math.random());
      this.currentWidth = 0;
      this.buffered = null;
  }

  init(){
      return new Promise((resolve, reject)=>{
        $.getScript("https://player.vimeo.com/api/player.js")
          .done((script,textStatus) => {
            if(this.video.fullscreen){
                this.webkitEnterFullscreen();
            }
            const playerCode = `<div id="${this.domId}"></div>`;
            const videoContainer = $(this.container).find('.video-container')[0];
            $(videoContainer).html(playerCode);
            let vimeoID = this.video.src;
            if(vimeoID == undefined){
              vimeoID = this.video.id;
            }
            const width = $(videoContainer).width();
            const videoPlayer = new Vimeo.Player(this.domId, {
                id: vimeoID,
                width: width,
                maxwidth: '100%',
                maxheight: '100%',
                responsive: true,
                playsinline: true,
                byline: false,
                speed: true,
                controls: false,
            });
            // preload vimeo with play pause
            var self = this;
            videoPlayer.setMuted(true).then(function(){
              videoPlayer.play().then(function() {
                // the video was played so trigger buffering start
                videoPlayer.pause().then(function(){
                  videoPlayer.setMuted(false);
                  if(self.video.startAt!==undefined){
                      //var time = Math.round(this.video.startAt);
                      var time = self.video.startAt;
                      videoPlayer.setCurrentTime(time);
                  }
                  let checkWidth = ()=>{
                      let vimeoIframe = $(videoContainer).find('iframe')[0];
                      if(vimeoIframe===undefined){
                          return setTimeout(checkWidth, 300);
                      }
                      $(vimeoIframe).attr('tabindex','-1');
                      $(vimeoIframe).css('width','100%');
                      self.currentWidth = $(vimeoIframe).width();

                      self.intervalId = setInterval(()=>{
                          let currentOrientation;
                          if(window.innerHeight > window.innerWidth){
                              currentOrientation = 'portrait';
                          }
                          if(window.innerWidth > window.innerHeight){
                              currentOrientation = 'landscape';
                          }
                          let vimeoIframe = $(videoContainer).find('iframe')[0];
                          $(vimeoIframe).css('width','100%');
                          var width = $(vimeoIframe).width();

                          if((width!==self.currentWidth)||(self.orientation!==currentOrientation)){
                              self.orientation = currentOrientation;
                              self.currentWidth = width;
                              let height = width * 0.56;
                              let windowHeight = $(window).height();
                              if((self.fullScreen)||(height>windowHeight)){
                                  let barHeight = $($(self.container).find('.control-bar')[0]).height();
                                  height = windowHeight - barHeight;
                              }
                              $(vimeoIframe).css('height', height+'px');
                          }
                          self.currentWidth = width;
                      }, 300);
                  };

                  setTimeout(checkWidth, 100);

                  self.buffered = new VimeoBuffer(videoPlayer);
                  self.videoPlayer = videoPlayer;
                  resolve();
                });
              });

            });
            


            
        });
      });
  }

  destroy(){
      clearInterval(this.intervalId);
  }

  webkitExitFullscreen(){
      this.fullScreen = false;
      $(this.container).removeClass('vimeo-fullscreen');
  }

  webkitEnterFullscreen(){
      $(this.container).addClass('vimeo-fullscreen');
      this.fullScreen = true;
  }

  canChangeSpeedRate(){
      return new Promise((resolve, reject)=>{
          resolve(true);
          /*
          this.videoPlayer.getPlaybackRate().then((playbackRate)=>{
              this.videoPlayer.setPlaybackRate(playbackRate).then((ret)=>{
                  resolve(true);
              }).catch((error) => {
                  resolve(true);
              });
          }).catch((error) => {
              resolve(true);
          });
          */
      });
  }

  getPosibleSpeedRates(){
      return new Promise((resolve, reject)=>{
          this.videoPlayer.getPlaybackRate().then((playbackRate)=>{
            this.videoPlayer.setPlaybackRate(playbackRate).then((ret)=>{
              resolve([0.5,1,1.5,2]);
            }).catch((error) => {
              resolve([1]);
            });
          }).catch((error) => {
            resolve([1]);
          });
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
      return new Promise((resolve, reject)=>{
            resolve(this.videoPlayer.getCurrentTime());
      });
      
  }

  setCurrentTime(time){
      return new Promise((resolve, reject)=>{
        this.videoPlayer.setCurrentTime(time).then((time)=>{
          resolve(time);
        }).catch(function(error){
          console.log(error);
          resolve(error);
        });
      });
      
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
          resolve(this.video.id);
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
        videoOps.fullscreen = this.notSupportedStandarFullScreen;
        const video = new VimeoPlayer(videoOps, this.container);
        video.init().then(()=>{
            resolve(video);
        });
    });
};
