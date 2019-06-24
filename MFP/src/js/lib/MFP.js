/**
 * MFP AccessPlayer v.1.0.2
 * http://smartplayer.mfpst.com
 *
 * Copyright MFP Multimedia France Productions
 * Released under GPL 3 licence
 * backgroundImage: "key"
 * Date : 2018-10-16T14:58Z
 */
 import MFP_Menu from './MFP_Menu';
 import MFP_Track from './MFP_Track';

const _ = require('lodash');

export default class MFP{

  constructor(){
      this.default_options = {
            type: 'html5',
            lang:'',
            videos:{lowdef:'', audiodesc:'', signed:''},
            transcripts:{txt:'',html:''},
            live:'',
            theme_class:''
      };
      var element = arguments[0];
      if(arguments.length > 1){
          var options = arguments[1];
      }else{
          var options = {};
      }
      this.options = $.extend( {}, this.default_options, options );
      this.startElement = element;
      this.subtitles=[];
      this.captions=[];
      this.descriptions=[];
      this.chapters=[];
      this.metadata=[];
      this.lang={};
      this.liveOn=false;
      this.seeking=false;
      this.tracks = [];
  }

  init(){
      // Load Video Player
      this.getMainVideo().then((mainVideo)=>{
          this.options.videos.highdef = mainVideo;
          this.loadLang().then(()=>{
              this.loadTracks().then(()=>{
                this.loadInterface().then(()=>{
                    this.initChapters();
                    this.loadVideo(mainVideo).then(()=>{
                        this.videoPlayer.setControls(false);
                        this.videoPlayer.setTabIndex(-1);
                        this.initEvents();
                    });
                });
              });
          }, ()=>{
              console.log('Error, default lang script can not be loaded');
          });
      });
  }

  getMainVideo(){
      return new Promise((resolve, reject)=>{
          if(this.options.type==='vimeo'){
              resolve({
                  type: this.options.type,
                  id: this.options.id
              });
          }else{
              const source = $(this.startElement).find('source')[0];
              const src  = $(source).attr('src');
              resolve(src);
          }
      });
  }

  loadVideo(video){
      return new Promise((resolve, reject)=>{
          let type = 'html5';
          if(video.type!==undefined){
              type = video.type;
          }
          let videoLoader = 'loadVideo'+_.capitalize(type);
          if(this[videoLoader]==undefined){
              let name = 'loadVideoPlayer-'+ type.toLowerCase();
              $.getScript(mfpPath+'video-players/'+name+'.js')
                .done((script,textStatus)=>{
                    this.loadVideo(video).then(()=>{
                        resolve();
                    });
                });
          }else{
              this[videoLoader](video).then((videoPlayer)=>{
                  this.videoPlayer = videoPlayer;
                  resolve();
              });
          }
      });
  }

  changeSource(src){
      return new Promise((resolve, reject) => {
          this.loadVideo(src).then(()=>{
              this.bindVideoEvents().then(()=>{
                  resolve();
              });
          });
      });
  }

  bindVideoEvents(){
      return new Promise((resolve, reject)=>{
          const videoPlayer = this.videoPlayer;
          videoPlayer.on('loadedmetadata', ()=>{
              this.fontSize();
          });
          videoPlayer.on('play', (e)=>{
              $(this.container).find('.play').removeClass('mfp-icon-play').addClass('mfp-icon-pause');
              $(this.container).find('.play span').html(this.lang.pause);
              $(this.container).find('.play').attr('title',this.lang.pause);
              $(this.container).find('.play').attr('aria-label',this.lang.pause);
          });
          videoPlayer.on('pause', (e) => {
              $(this.container).find('.play').removeClass('mfp-icon-pause').addClass('mfp-icon-play');
              $(this.container).find('.play span').html(this.lang.play);
              $(this.container).find('.play').attr('title',this.lang.play);
              $(this.container).find('.play').attr('aria-label',this.lang.play);
          });
          videoPlayer.on('timeupdate', (e)=>{
              videoPlayer.getCurrentTime().then((time)=>{
                  videoPlayer.getDuration().then((duration)=>{
                    if(!this.seeking){
                        $(this.container).find('.progress-bar').slider('option','value',(time/duration)*100);
                    }
                    var tmp = Math.round(time);
                    var hr = 0;
                    var min = 0;
                    var minute = 0;
                    var sec = 0;
                    var dura = '';
                    sec = tmp%60;
                    min = ((tmp - sec) / 60)%60;
                    minute = ((tmp - sec) / 60);
                    hr = (tmp - sec - 60 * min) / 3600;
                    if(hr > 0){
                        dura=hr+':';
                    }
                    if(sec < 10 ){
                        sec = '0' + sec;
                    }
                    if(min < 10 && hr > 0){
                        min = '0' + min;
                    }
                    dura=dura+min+':'+sec;

                    $(this.container).find('.timer-current').html(dura);
                    var h = this.progressBar.find('.ui-slider-handle');
                    //$(this.controlBar).find('.progress-bar').attr('aria-valuetext',min+':'+sec+' '+this.lang.on+' '+this.duration);
                    h.attr('aria-valuetext',dura+' '+this.lang.on+' '+this.duration);
                    h.attr('aria-valuenow',(time/duration)*100);
                  });
              });
          });
          videoPlayer.on('durationchange', (e)=>{
              this.initDuration();
          });
          videoPlayer.on('progress', (e)=>{
              videoPlayer.getBuffered().then((buffer)=>{
                  videoPlayer.getDuration().then((duration)=>{
                      if(buffer.length>0){
                          var left = Math.round((buffer.start(0)/duration)*10000) / 100;
                          var width = (Math.round((buffer.end(0)/duration)*10000) / 100) - left;
                          var b = $(this.container).find('.progress-buffer .buffer');
                          b.css('left',left + '%');
                          b.css('width',width + '%');
                      }
                  });
              });
          });
          for(let track of this.tracks){
              track.setVideoPlayer(videoPlayer);
          }
          resolve();
          /*
          video.on('volumechange',function(e){
              var volume = this.videoPlayer.volume/100;
              $(this.container).find('.sound-range')[0].value=volume;
              this.soundUpdate();
          }.bind(this));
          */
      });
  }


  loadLang(){
      return new Promise((resolve, reject)=>{
          if(this.options.lang==''){
              // getting lang of html tag :
              var l = $('html').attr('lang').substring(0,2);
              if(l==''){
                  l='en';
              }
              this.options.lang=l;
          }
          $.getScript(mfpPath+'lang/'+this.options.lang+'.js')
              .done((script,textStatus)=>{
                  if(MFPDebug){
                      console.log('Lang script ' + this.options.lang + ' loaded');
                  }
                  this.lang=lang;
                  resolve();
              })
              .fail((jqxhr, settings, exception)=>{
                  console.log('Lang script ' + this.options.lang + ' couldn\'t be loaded, loading default one in English');
                  $.getScript(mfpPath+'lang/en.js')
                      .done((script,textStatus)=>{
                          console.log('Default Lang script loaded');
                          this.lang=lang;
                          resolve();
                      })
                      .fail((jqxhr, settings, exception)=>{
                          reject();
                      });
            });
      });
  }

  loadTracks(){
      return new Promise((resolve, reject)=>{
          if(MFPDebug){
              console.log('loading tracks');
          }
          var tt = $(this.startElement).find('track');
          var cont = tt.length;
          for(var i=0; i < tt.length; i++){
              var track = new MFP_Track(tt[i]);
              if(MFPDebug){
                  console.log('track');
                  console.log(tt[i]);
                  console.log(tt[i].readyState);
              }
              track.mode='hidden';
              if(track.kind==='subtitles'){
                  track.subid = this.subtitles.length;
                  track.pos   = this.subtitles.length;
                  this.subtitles.push({'id':i,'track':track});
              }
              else if(track.kind==='captions'){
                  track.pos = this.captions.length;
                  this.captions.push({'id':i,'track':track});
              }
              else if(track.kind==='chapters'){
                  track.pos = this.chapters.length;
                  this.chapters.push({'id':i,'track':track});
              }
              else if(track.kind==='descriptions'){
                  track.pos = this.descriptions.length;
                  this.descriptions.push({'id':i,'track':track});
              }
              else if(track.kind==='metadata'){
                  track.pos = this.metadata.length;
                  this.metadata.push({'id':i,'track':track});
              }
              //setting up load event for track
              track.on('load', (track) => {
                  if(MFPDebug){
                      console.log('track load');
                  }
                  cont--;
                  if(cont==0){
                      resolve();
                  }
                  this.loadedTrack(track);
              });
              track.on('error', (track) =>{
                  this.loadedTrackError(track);
                  cont--;
                  if(cont==0){
                      resolve();
                  }
              });
              track.load();
              this.tracks.push(track);
          }
      });
  }

  loadedTrackError(track){
        if(track.kind==='subtitles'){
            //this.subtitles.splice($(track).data('pos'),1);
            var filename = track.src;
            var ext = filename.split('.').pop().toLowerCase();
            //console.log(track);
            //console.log(ext);
            console.log(track);
            if (typeof MFP.prototype['loadTrackType'+ext.toUpperCase()] === "undefined") {
                if(MFPDebug){
                    console.log('need to load JS to take care of .'+ext+' files track');
                }
                $.getScript(mfpPath+'trackreader/loadTrackType-'+ext+'.js')
                    .done((script,textStatus)=>{
                        var method = 'loadTrackType'+ext.toUpperCase();
                        if(MFPDebug){
                          console.log('File Track reader for .'+ext+' loaded');
                        }
                        this[method](this,filename,track);
                    })
                    .fail((jqxhr, settings, exception)=>{
                        console.log('No file track reader available for .'+ext);
                        track.mode='disabled';
                        this.initSubtitlesMenu();
                    });
            }
            else{
                MFP.prototype['loadTrackType-'+ext.toUpperCase()](this,filename,track.track);
            }
        }
  }

  loadedTrack(track){
        var filename = track.src;
        var ext = filename.split('.').pop().toLowerCase();
        track.ext=ext;
        if(track.kind==='subtitles'){
            if(track.cues.length==0){
                track.mode='disabled';
                if(MFPDebug){
                    console.log('deleting '+$(track).data('pos'));
                }
                this.subtitles.splice($(track).data('pos'),1);
            }
            else{
                // setup cues event :
                for(var i=0; i<track.cues.length;i++){
                    var cue = track.cues[i];
                    console.log(cue);
                    cue.on('enter', (cue) =>{
                        console.log(cue);
                        if(cue.track.mode2=='showing'){
                            this.displayCue(cue);
                            if(this.options.live!=''){
                                $(this.options.live).find('.live-'+cue.track.subid+'-'+cue.id).addClass('selected');
                                $(this.options.live).find('.live-'+cue.track.subid+'-'+cue.id).wrap('<mark>');
                            }
                        }
                    });
                    cue.on('exit', (cue)=>{
                        console.log(cue);
                        if(cue.track.mode2=='showing'){
                            $(this.container).find('.mfp-subtitles-wrapper .sub-'+cue.track.subid+'-'+cue.id).remove();
                            if(this.options.live!=''){
                                $(this.options.live).find('.live-'+cue.track.subid+'-'+cue.id).removeClass('selected');
                                $(this.options.live).find('.live-'+cue.track.subid+'-'+cue.id).unwrap('mark');
                            }
                        }
                    });
                }
            }
            this.initSubtitlesMenu();
        }
    }

    displayCue(cue){
        console.log("DISPLAYING CUE");
        let txt = cue.getCueAsHTML();
        var div = document.createElement('div');
        div.appendChild( txt.cloneNode(true) );
        txt=div.innerHTML.replace(/\n/g,"<br />");
        txt=txt.replace(/^<div>/,'').replace(/<\/div>$/,'');
        if(MFPDebug){
          console.log(cue.track);
        }
        // removing div from firefox bad WEBVTT integration
        var sub = $('<div class="sub-'+cue.track.subid+'-'+cue.id+'"><span class="mfp-subtitles">'+txt+'</span></div>');
        //sub.find('.svp-subtitles').append(cue.getCuesAsHTML());
        console.log("SUBTITULOS");
        console.log(sub);
        $(this.container).find('.mfp-subtitles-wrapper').append(sub);
        var div = $(this.container).find('.mfp-subtitles-wrapper .sub-'+cue.track.subid+'-'+cue.id);
        if(MFPDebug){
            console.log(cue);
        }
        if(cue.align=="middle" || cue.align=="center"){
            div.css('text-align','center');
        } else if(cue.align=='start'){
            div.css('text-align','left');
        } else if(cue.align=='end'){
            div.css('text-align','right');
        }
        if(cue.line==parseInt(cue.line)){
            // line number
            if(cue.line>=0){
                div.css('top',((cue.line*5)-5)+'%');
            }
            else{
                var pour=cue.line+1;
                div.css('bottom',(pour*5)+'%');
            }
        }
        else{
            if(cue.line=='auto'){
                div.css('bottom','0');
            }
            else{
                var val = parseInt(cue.line);
                if(val<50){
                    div.css('top',val+'%');
                } else if(val>50){
                    div.css('bottom',(100-val)+'%');
                } else{
                    div.css('top','50%');
                    div.css('transform','translateY(-50%)');
                }
            }
        }
        div.css('width',cue.size+'%');
        if(cue.position<50){
            div.css('left',cue.position+'%');
        } else if(cue.position>50){
            div.css('right',(100-cue.position)+'%');
        } else{
            div.css('left','50%');
            div.css('transform','translateX(-50%)');
        }

    }

    redrawCues(){
        var div = $(this.container).find('.mfp-subtitles-wrapper');
        div.empty();
        for(var i=0; i<this.subtitles.length;i++){
            var track = this.subtitles[i].track;
            if(track.mode2=='showing'){
                var cues = track.activeCues;
                for(var j = 0; j < cues.length; j++){
                    this.displayCue(cues[j]);
                }
            }
        }

    }

    updateLive(){
        if(MFPDebug){
            console.log('update live');
        }
        if(this.options.live!=''){
            var target=$(this.options.live);
            if(target.length>0){
                target.empty();
                if(this.liveOn){
                    for(var i=0;i<this.subtitles.length;i++){
                        if(this.subtitles[i].track.mode2=='showing'){
                            if(MFPDebug){
                                console.log(this.subtitles[i]);
                            }
                            var cues = this.subtitles[i].track.cues;
                            if(MFPDebug){
                                console.log(cues);
                            }
                            for(var j=0; j < cues.length; j++){
                                var l = $("<div tabindex='0' class='live-"+i+"-"+cues[j].id+" mfp-live' data-tcin='"+cues[j].startTime+"' data-tcout='"+cues[j].endTime+"'>"+cues[j].text.replace(/<[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}>/g,"").replace(/\n/g,'<br />')+"</div>");
                                l.click(function(e){
                                  if(MFPDebug){
                                      console.log(e);
                                  }
                                  var tcin = $(e.currentTarget).data('tcin');
                                  if(MFPDebug){
                                      console.log('setting video currentTime to : '+tcin);
                                  }
                                  this.redrawCues();
                                  this.videoPlayer.setCurrentTime(tcin);
                                  this.redrawCues();
                                }.bind(this));
                                l.keypress(function(event){
                                    var keycode = (event.keyCode ? event.keyCode : event.which);
                                    if(keycode == '13'){
                                        this.click();
                                    }
                                });
                                target.append(l);
                            }
                        }
                    }
                }
            }
        }
    }

    fontSize(){
        var videoObj = $(this.container).find('.video-container')[0];
        var subwrapper = $(this.container).find('.mfp-subtitles-wrapper');
        var fsize = ($(videoObj).height()/20);
        subwrapper.css('font-size',fsize+'px');
        subwrapper.css('line-height','1.6');
        // setting subtiltes-wrapper height to video height:
        subwrapper.css('height',$(videoObj).height()+'px');
    }

    loadInterface(){
        // load the interface of the player
        return new Promise((resolve, reject)=>{
            var videoObj = this.startElement;
            $(videoObj).addClass('mfp');
            $(videoObj).wrap($("<div class='mfp-wrapper "+this.options.theme_class+"'><div class='video-container'></div></div>"));
            this.container = $(videoObj).parent().parent();
            // adding control-bar
            this.container.append($('<div class="mfp-subtitles-wrapper" />'));
            var subwrapper = $(this.container).find('.mfp-subtitles-wrapper');
            var fsize = ($(videoObj).height()/20);
            subwrapper.css('font-size',fsize+'px');
            // add event tracking on window resize to update fontsize to make it proportional
            $( window ).resize(function() {
                this.fontSize();
            }.bind(this));

            this.controlBar = $("<div class='control-bar' role='region' aria-label='"+this.lang.video_player+"''></div>");
            $(window).resize(function(){
                $(this.container).find('.mfp-subtitles-wrapper').css('height','calc(100% - '+(this.controlBar.height()+8)+'px)');
            }.bind(this));
            $(this.container).append($(this.controlBar));

            // adding progress-bar
            this.progressBuffer = $("<div class='progress-buffer'><div class='buffer'></div></div>");
            $(this.controlBar).append(this.progressBuffer);
            this.progressBar = $('<div class="progress-bar" />');
            this.progressBar.slider({'min':0,'max':100,step: 0.01,animate: false,range: "min",role:'slider','aria-valuemin':'O','aria-valuemax':'100','aria-valuenow':'00:00:00','aria-valuetext':'Init','aria-label':this.lang.searchBar});
            var h = this.progressBar.find('.ui-slider-handle');
            h.attr('role','slider');
            h.attr('aria-valuemin','0');
            h.attr('aria-valuemax','0');
            h.attr('aria-valuenow','100');
            h.attr('aria-valuetext','');
            h.attr('aria-label',this.lang.searchBar);
            h.unbind('keydown');
            $(this.controlBar).append(this.progressBar);
            var leftPart = $("<div class='left-part' />");
            $(this.controlBar).append($(leftPart));
            $(leftPart).append('<button class="mfp-icon-play play" title="'+this.lang.play+'" aria-label="'+this.lang.play+'"><span class="mfp-hidden">'+this.lang.play+'</span></button>');
            var soundPart = $("<span class='soundPart'></span>");
            $(leftPart).append($(soundPart));
            $(soundPart).append('<button class="mfp-icon-volume-up sound" title="'+this.lang.soundOff+'"><span class="mfp-hidden">'+this.lang.soundOff+'</span></button>');
            //this.soundBar = $('<div class="sound-range" aria-label="'+this.lang.volume+'" aria-valuetext="100% '+this.lang.volume+'">');
            this.soundBar = $('<div class="sound-range">');
            this.soundBar.slider({'min':0,'max':100,'value':100,'step':10,animate:false,range:'min'});
            var h = this.soundBar.find('.ui-slider-handle');
            h.attr('role','slider');
            h.attr('aria-valuemin','0');
            h.attr('aria-valuemax','0');
            h.attr('aria-valuenow','100');
            h.attr('aria-valuetext','100% '+this.lang.volume);
            h.attr('aria-label',this.lang.volume);

            $(soundPart).append(this.soundBar);
            $(leftPart).append("<span class='timer'><span class='timer-current'>0:00</span> / <span class='timer-duration'>00:00</span></span>");

            var rightPart = $("<div class='right-part' />");
            $(this.controlBar).append($(rightPart));
            // adding speed control
            $(rightPart).append('<select class="speed" aria-label="'+this.lang.playBackrate+'" title="'+this.lang.playBackrate+'"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select>');
            // if having video alternatives, showing the videos buttons
            if((this.options.videos.lowdef!='' && this.options.videos.lowdef!=undefined) || (this.options.videos.audiodesc!='' && this.options.videos.audiodesc!=undefined) || (this.options.videos.signed!='' && this.options.videos.signed!=undefined)){
                $(rightPart).append('<button class="mfp-icon-hd video_hd" title="'+this.lang.desactivate+' '+this.lang.highdef+'"><span class="mfp-hidden">'+this.lang.desactivate+' '+this.lang.highdef+'</span></button>');
                if((this.options.videos.audiodesc!='' && this.options.videos.audiodesc!=undefined)){
                    $(rightPart).append('<button class="mfp-icon-audio-description video_audiodesc off" title="'+this.lang.activate+' '+this.lang.audiodesc+'"><span class="mfp-hidden">'+this.lang.activate+' '+this.lang.audiodesc+'</span></button>');
                }
                if((this.options.videos.signed!='' && this.options.videos.signed!=undefined)){
                    $(rightPart).append('<button class="mfp-icon-sign-language video_signed off" title="'+this.lang.activate+' '+this.lang.signed+'"><span class="mfp-hidden">'+this.lang.activate+' '+this.lang.signed+'</span></button>');
                }
                //$(rightPart).append('<div class="videos-block"><button class="mfp-icon-videos videos" title="'+this.lang.videos+'"><span class="svp-hidden">'+this.lang.videos+'</span></button><ul class="menu" title="'+this.lang.videos+'" /></ul>');
                this.initVideosAlt();
            }
            $(rightPart).append('<div class="subtitles-block"></div>');
            $(rightPart).append('<div class="pref-block"></div>');
            $(rightPart).append('<div class="chapters-block"></div>');
            // if having transcripts, display the transcript button
            if((this.options.transcripts.html!='' && typeof this.options.transcripts.html !== "undefined") || (this.options.transcripts.txt!='' && typeof this.options.transcripts.txt !== "undefined") || this.options.live!=''){
                $(rightPart).append('<div class="transcripts-block"><button class="mfp-icon-download transcripts off" title="'+this.lang.transcripts+'"><span class="mfp-hidden">'+this.lang.transcripts+'</span></button><ul class="menu" title="'+this.lang.transcripts+'" /></ul></div>');
                this.initTranscripts();
            }
            $(rightPart).append('<button class="mfp-icon-info infos" title="'+this.lang.informations+'"><span class="mfp-hidden">'+this.lang.informations+'</span></button>');
            $(rightPart).append('<button class="mfp-icon-expand expand" title="'+this.lang.expand+'"><span class="mfp-hidden">'+this.lang.expand+'</span></button>');
            this.fontSize();
            resolve();
        });
    }

    initEvents(){
        this.initFullScreenEvents();
        this.initPlayEvents();
        this.initDuration();
        this.initSoundEvents();
        this.initPlayBackSpeedEvents();
        this.bindVideoEvents();
        this.progressEvents();
        this.initInfos();
    }

    initInfos(){
        $(this.container).find('.right-part').append($('<div class="menu menu-infos" title="'+this.lang.informations+'"></div>'));
        var menu = $(this.container).find('.right-part .menu-infos');
        menu.load(mfpPath+'/infos/'+this.options.lang+'.html?t='+(new Date).getTime());
        menu.dialog({ width: 540, autoOpen: false, resizable: false,closeText: this.lang.close, position: { my: "right+30 bottom", at: "left top", of: $(this.container).find('.right-part .infos') } });
        menu.dialog({
          appendTo: $(this.container).find('.right-part')
        });

        $(this.container).find('.right-part .infos').click(function(){

            $(this.container).find('.right-part .menu-infos').dialog('open');
        }.bind(this));

    }

    initPrefMenu(){
        //$(this.container).find('.right-part .pref-block').append($('<button tabindex="0" class="mfp-icon-pref preferences" aria-label="'+this.lang.preferences+'" /><ul class="menu" title="'+this.lang.preferences+'" /></ul>'));
        $(this.container).find('.right-part .pref-block').append($('<div class="menu" title="'+this.lang.preferences+'" /></div>'));
        /*
        var btn = $(this.container).find('.right-part .pref-block .preferences');
        btn.click(function(){
            $(this.container).find('.right-part .pref-block .menu').dialog( "open" );
        }.bind(this));
        */
        var menu = $(this.container).find('.right-part .pref-block .menu');
        // adding custom subtitles fileds :
        var sel = $('<label><span class="mfp-label-name">'+this.lang.fontSize+'</span><select name="font-size"><option value="50">50%</option><option value="100" selected>100%</option><option value="150">150%</option><option value="200">200%</option><option value="300">300%</option><option value="400">400%</option></select></label><br />');
        menu.append(sel);
        var sel = $(this.container).find('.right-part .pref-block .menu select[name="font-size"]');
        sel.change(function(){
            var sel = $(this.container).find('.right-part .pref-block .menu select[name="font-size"]');
            var fontsize = sel[0].value;
            $(this.container).removeClass (function (index, css) {
                return (css.match (/(^|\s)font-size-\S+/g) || []).join(' ');
            });
            $(this.container).addClass('font-size-'+fontsize);
        }.bind(this));
        $(menu[0]).append($('<label><span class="mfp-label-name">'+this.lang.fontFamily+'</span><select name="font-family">\
            <option value="s-mono">'+this.lang.ffSerifMono+'</option>\
            <option value="s-prop">'+this.lang.ffSerifProp+'</option>\
            <option value="ss-mono">'+this.lang.ffSansSerifMono+'</option>\
            <option value="ss-prop" selected>'+this.lang.ffSansSerifProp+'</option>\
            <option value="c">'+this.lang.ffCursive+'</option>\
            <option value="sc">'+this.lang.ffSmallCaps+'</option>\
        </select></label><br />'));
        var sel = $(this.container).find('.right-part .pref-block .menu select[name="font-family"]');
        sel.change(function(){
            var sel = $(this.container).find('.right-part .pref-block .menu select[name="font-family"]');
            var family = sel[0].value;
            $(this.container).removeClass (function (index, css) {
                return (css.match (/(^|\s)font-family-\S+/g) || []).join(' ');
            });
            $(this.container).addClass('font-family-'+family);
            console.log('changing font-family to '+family);
        }.bind(this));
        $(menu[0]).append($('<label><span class="mfp-label-name">'+this.lang.fontColor+'</span><select name="font-color">\
            <option value="white" selected>'+this.lang.white+'</option>\
            <option value="yellow">'+this.lang.yellow+'</option>\
            <option value="green">'+this.lang.green+'</option>\
            <option value="cyan">'+this.lang.cyan+'</option>\
            <option value="blue">'+this.lang.blue+'</option>\
            <option value="magenta">'+this.lang.magenta+'</option>\
            <option value="red">'+this.lang.red+'</option>\
            <option value="black">'+this.lang.black+'</option>\
        </select></label><br />'));
        var sel = $(this.container).find('.right-part .pref-block .menu select[name="font-color"]');
        sel.change(function(){
            var sel = $(this.container).find('.right-part .pref-block .menu select[name="font-color"]');
            var color = sel[0].value;
            $(this.container).removeClass (function (index, css) {
                return (css.match (/(^|\s)font-color-\S+/g) || []).join(' ');
            });
            $(this.container).addClass('font-color-'+color);
            console.log('changing font-color to '+color);
        }.bind(this));

        $(menu[0]).append($('<label><span class="mfp-label-name">'+this.lang.fontShadowColor+'</span><select name="font-shadow-color">\
            <option value="FFFFFF" selected>'+this.lang.white+'</option>\
            <option value="FFFF00">'+this.lang.yellow+'</option>\
            <option value="008000">'+this.lang.green+'</option>\
            <option value="00FFFF">'+this.lang.cyan+'</option>\
            <option value="0000FF">'+this.lang.blue+'</option>\
            <option value="FF00FF">'+this.lang.magenta+'</option>\
            <option value="FF0000">'+this.lang.red+'</option>\
            <option value="0000">'+this.lang.black+'</option>\
        </select></label><br />'));
        var sel = $(this.container).find('.right-part .pref-block .menu select[name="font-shadow-color"]');
        sel.change(function(){
            var sel = $(this.container).find('.right-part .pref-block .menu select[name="font-shadow-color"]');
            var sel2 = $(this.container).find('.right-part .pref-block .menu select[name="font-shadow-size"]');
            var color = sel[0].value;
            var size = sel2[0].value;
            $(this.container).removeClass (function (index, css) {
                return (css.match (/(^|\s)font-shadow-\S+/g) || []).join(' ');
            });
            $(this.container).addClass('font-shadow-'+color+'-'+size);
        }.bind(this));
        $(menu[0]).append($('<label><span class="mfp-label-name">'+this.lang.fontShadowSize+'</span><select name="font-shadow-size">\
            <option value="0" selected>'+this.lang.none+'</option>\
            <option value="1">'+this.lang.small+'</option>\
            <option value="3">'+this.lang.medium+'</option>\
            <option value="5">'+this.lang.large+'</option>\
        </select></label><br />'));
        var sel = $(this.container).find('.right-part .pref-block .menu select[name="font-shadow-size"]');
        sel.change(function(){
            var sel = $(this.container).find('.right-part .pref-block .menu select[name="font-shadow-color"]');
            var sel2 = $(this.container).find('.right-part .pref-block .menu select[name="font-shadow-size"]');
            var color = sel[0].value;
            var size = sel2[0].value;
            $(this.container).removeClass (function (index, css) {
                return (css.match (/(^|\s)font-shadow-\S+/g) || []).join(' ');
            });
            $(this.container).addClass('font-shadow-'+color+'-'+size);
        }.bind(this));


        $(menu[0]).append($('<label><span class="mfp-label-name">'+this.lang.backgroundColor+'</span><select name="bkg-color">\
            <option value="white">'+this.lang.white+'</option>\
            <option value="yellow">'+this.lang.yellow+'</option>\
            <option value="green">'+this.lang.green+'</option>\
            <option value="cyan">'+this.lang.cyan+'</option>\
            <option value="blue">'+this.lang.blue+'</option>\
            <option value="magenta">'+this.lang.magenta+'</option>\
            <option value="red">'+this.lang.red+'</option>\
            <option value="black" selected>'+this.lang.black+'</option>\
        </select></label><br />'));

        $(menu[0]).append($('<label><span class="mfp-label-name">'+this.lang.backgroundOpacity+'</span><select name="bkg-opacity">\
            <option value="0">0%</option>\
            <option value="25">25%</option>\
            <option value="50" selected>50%</option>\
            <option value="75">75%</option>\
            <option value="100">100%</option>\
        </select></label><br />'));

        var sel = $(this.container).find('.right-part .pref-block .menu select[name="bkg-color"]');
        sel.change(function(){
            var sel = $(this.container).find('.right-part .pref-block .menu select[name="bkg-color"]');
            var sel2 = $(this.container).find('.right-part .pref-block .menu select[name="bkg-opacity"]');
            var color = sel[0].value;
            var opa = sel2[0].value;
            $(this.container).removeClass (function (index, css) {
                return (css.match (/(^|\s)background-\S+/g) || []).join(' ');
            });
            $(this.container).addClass('background-'+color+'-'+opa);
        }.bind(this));
        var sel = $(this.container).find('.right-part .pref-block .menu select[name="bkg-opacity"]');
        sel.change(function(){
            var sel = $(this.container).find('.right-part .pref-block .menu select[name="bkg-color"]');
            var sel2 = $(this.container).find('.right-part .pref-block .menu select[name="bkg-opacity"]');
            var color = sel[0].value;
            var opa = sel2[0].value;
            $(this.container).removeClass (function (index, css) {
                return (css.match (/(^|\s)background-\S+/g) || []).join(' ');
            });
            $(this.container).addClass('background-'+color+'-'+opa);
        }.bind(this));
        var btn = $(this.container).find('.right-part .subtitles-block .subtitles');
        $(menu[0]).dialog({ width: 540, autoOpen: false, resizable: false,closeText: this.lang.close, position: { my: "right+30 bottom", at: "left top", of: btn } });
        $(menu[0]).dialog({
          appendTo: $(this.container).find('.right-part .pref-block')
        });
    }

    initSubtitlesMenu(){
        var toload=true;
        for(var i=0;i<this.subtitles.length;i++){
            if(this.subtitles[i].track.cues.length==0){
                toload=false;
            }
        }
        if(toload && this.subtitles.length>0){
            $(this.container).find('.right-part .subtitles-block').append($('<button class="mfp-icon-cc subtitles off" title="'+this.lang.subtitles+'"><span class="mfp-hidden">'+this.lang.subtitles+'</span></button><ul class="menu" title="'+this.lang.subtitles+'" /></ul>'));

            var btn = $(this.container).find('.right-part .subtitles-block .subtitles');
            btn.click(function(){
                $(this.container).find('.right-part .subtitles-block .menu').dialog( "open" );
            }.bind(this));

            var menu = $(this.container).find('.right-part .subtitles-block .menu');

            var men = $('<li class="no-subtitles selected">'+this.lang.nosubtitles+'</li>');
            $(menu[0]).append(men);
            //console.log('this.subtiltes.length : ');
            //console.log(this.subtitles.length);
            var men = $('<li class="preferences" style="display: none;">'+this.lang.preferences+' <span class="mfp-icon-pref"></span></li>');
            men.uniqueId();
            var pref_id = men.attr('id');
            for(var i = 0;i<this.subtitles.length;i++){
                var track = this.subtitles[i].track;
                //console.log(track);
                //console.log('track');
                var t = $('<li data-id="'+i+'">'+track.label+'</li>');
                if(track.ext=='srt'){
                  t.attr('aria-owns',pref_id);
                }
                $(menu[0]).append(t);
            }

            $(menu[0]).append(men);
            var m = new MFP_Menu($(menu[0]),{
                select:function(elmt){
                    if($(elmt).hasClass('preferences')){
                       $(this.container).find('.right-part .pref-block .menu').dialog( "open" );
                    }
                    else{
                        $(this.container).find('.subtitles-block  button.subtitles').addClass('off');
                        $(this.container).find('.subtitles-block  button.subtitles').attr('title',this.lang.activate+' '+this.lang.subtitles);
                        $(this.container).find('.subtitles-block  button.subtitles .mfp-hidden').html(this.lang.activate+' '+this.lang.subtitles);
                        $(elmt).parent().children('li').removeClass('selected');
                        $(elmt).addClass('selected');
                        $(this.container).removeClass (function (index, css) {
                            return (css.match (/(^|\s)track-\S+/g) || []).join(' ');
                        });
                        for(var j=0;j<this.subtitles.length;j++){
                            this.subtitles[j].track.mode='hidden';
                            this.subtitles[j].track.mode2='hidden';
                            //console.log(this.subtitles[j].track);
                        }
                        if(!$(elmt).hasClass('no-subtitles')){
                            this.subtitles[$(elmt).data('id')].track.mode='hidden';
                            this.subtitles[$(elmt).data('id')].track.mode2='showing';
                            if(this.subtitles[$(elmt).data('id')].track.ext=='srt'){
                                $(elmt).parent().children('li.preferences').css('display','block');
                            }
                            else{
                                $(elmt).parent().children('li.preferences').css('display','none');
                            }
                            $(this.container).find('.subtitles-block  button.subtitles').removeClass('off');
                            $(this.container).find('.subtitles-block  button.subtitles').attr('title',this.lang.subtitles);
                        $(this.container).find('.subtitles-block  button.subtitles .mfp-hidden').html(this.lang.subtitles);
                            $(this.container).addClass('track-'+this.subtitles[$(elmt).data('id')].track.ext);
                        }
                        else{
                            $(elmt).parent().children('li.preferences').css('display','none');
                        }
                        this.redrawCues();
                        this.updateLive();
                        this.fontSize();
                    }
                    //this.videoPlayer.currentTime=$(elmt).data('start');
                    //$(this.container).find('.right-part .chapters-block .menu').dialog('close');
                }.bind(this)
            });
            m.init();

            $(menu[0]).dialog({ autoOpen: false, resizable: false,closeText: this.lang.close, position: { my: "right+30 bottom", at: "left top", of: btn } });
            $(menu[0]).dialog({
              appendTo: $(this.container).find('.right-part .subtitles-block')
            });
            this.initPrefMenu();
        }
    }

    initChapters(){
      if(MFPDebug){
          console.log('Loading chapters');
          console.log($(this.container).find('.right-part .chapters-block .chapters').length);
        }
        if(this.chapters.length>0 && this.chapters[0].track.cues.length>0 && $(this.container).find('.right-part .chapters-block .chapters').length==0){
            var rightPart = $(this.container).find('.right-part .chapters-block');
            $(rightPart).append('<button class="mfp-icon-chapters chapters" title="'+this.lang.chapters+'"><span class="mfp-hidden">'+this.lang.chapters+'</span></button><ul class="menu" title="'+this.lang.chapters+'"></ul>');
            var btn = $(this.container).find('.right-part .chapters-block .chapters');
            btn.click(function(){
                $(this.container).find('.right-part .chapters-block .menu').dialog( "open" );
            }.bind(this));
            var menu = $(this.container).find('.right-part .chapters-block .menu');
            var cues = this.chapters[0].track.cues;
            var currentTime = 0;
            for(var i = 0; i<cues.length ; i++){
                var cue = cues[i];
                var men = $('<li class="cue chapter-'+i+'" data-start="'+cue.startTime+'">'+cue.text+'</li>');
                if(currentTime>=cue.startTime && currentTime<cue.endTime){
                    $(men).addClass('selected');
                }
                $(menu[0]).append(men);
                cue.on('enter', function(){
                    $(this).attr('aria-selected','true');
                    $(this).addClass('selected');
                }.bind(men));
                cue.on('exit', function(){
                    $(this).removeAttr('aria-selected');
                    $(this).removeClass('selected');
                }.bind(men));
            }
            //$(menu[0]).menu({role:'listbox',items:'li'});
            var m = new MFP_Menu($(menu[0]),{
                select:function(elmt){
                    console.log('chapter selected');
                    this.videoPlayer.setCurrentTime($(elmt).data('start'));
                    $(this.container).find('.right-part .chapters-block .menu').dialog('close');
                }.bind(this)
            });
            m.init();

            $(menu[0]).dialog({ autoOpen: false, resizable: false,closeText: this.lang.close, position: { my: "left bottom", at: "left top", of: btn },maxHeight: 400 });
            $(menu[0]).dialog({
              appendTo: $(this.container).find('.right-part .chapters-block')
            });

            //this.reloadChapters();
            /*
            $(menu[0]).menu({select: function( event, ui ) {
                this.videoPlayer.currentTime=ui.item.data('start');
                $(this.container).find('.right-part .chapters-block .menu').dialog( "close" );
                //ui.item.css('background','green');
                //console.log();
            }.bind(this)});
            */
        }
    }

    initVideosAlt(){
        var btn = $(this.container).find('.video_hd');
        btn.click(()=>{
            $(this.container).find('.video_audiodesc').addClass('off');
            $(this.container).find('.video_audiodesc').attr('title',this.lang.activate+' '+this.lang.audiodesc);
            $(this.container).find('.video_audiodesc .mfp-hidden').html(this.lang.activate+' '+this.lang.audiodesc);

            $(this.container).find('.video_signed').addClass('off');
            $(this.container).find('.video_signed').attr('title',this.lang.activate+' '+this.lang.signed);
            $(this.container).find('.video_signed .mfp-hidden').html(this.lang.activate+' '+this.lang.signed);

            var btn = $(this.container).find('.video_hd');
            this.videoPlayer.getCurrentTime().then((time)=>{
                this.videoPlayer.getPaused().then((paused)=>{
                    if(btn.hasClass('off') || (this.options.videos.lowdef!='' && this.options.videos.lowdef!=undefined)){
                        this.videoPlayer.pause();
                        let src = null;
                        if(btn.hasClass('off')){
                            btn.removeClass('off');
                            if(btn.hasClass('mfp-icon-hd')){
                                src = this.options.videos.highdef;
                                if((this.options.videos.lowdef!='' && this.options.videos.lowdef!=undefined)){
                                    btn.attr('title',this.lang.activate+' '+this.lang.lowdef);
                                    btn.find('span').html(this.lang.activate+' '+this.lang.lowdef);
                                }
                            }
                            else{
                                src = this.options.videos.lowdef;
                                btn.attr('title',this.lang.activate+' '+this.lang.highdef);
                                btn.find('span').html(this.lang.activate+' '+this.lang.highdef);
                            }
                        }
                        else{
                            if(btn.hasClass('mfp-icon-hd')){
                                src = this.options.videos.lowdef;
                                btn.attr('title',this.lang.activate+' '+this.lang.highdef);
                                btn.find('span').html(this.lang.activate+' '+this.lang.highdef);
                                btn.removeClass('mfp-icon-hd');
                                btn.addClass('mfp-icon-ld');
                            }
                            else{
                                src = this.options.videos.highdef;
                                btn.attr('title',this.lang.activate+' '+this.lang.lowdef);
                                btn.find('span').html(this.lang.activate+' '+this.lang.lowdef);
                                btn.removeClass('mfp-icon-ld');
                                btn.addClass('mfp-icon-hd');
                            }
                        }
                        if(typeof(src)!=='object'){
                            src = {
                                src: src
                            };
                        }
                        src.startAt = time;
                        this.changeSource(src).then(()=>{
                            this.videoPlayer.on('canplay', (event)=>{
                                console.log("CAN PLAY, THEN SETTING CURRENT TIME");
                                this.videoPlayer.setCurrentTime(time);
                                if(!paused){
                                    this.videoPlayer.play();
                                }
                                this.videoPlayer.off('canplay');
                            });
                        });
                    }
                });
            });
        });

        $(this.container).find('.video_audiodesc').click(()=>{
            var btn = $(this.container).find('.video_audiodesc');
            btn.attr('title',this.lang.desactivate+' '+this.lang.audiodesc);
            btn.find('span').html(this.lang.desactivate+' '+this.lang.audiodesc);
            if(btn.hasClass('off')){
                if(!$(this.container).find('.video_hd').hasClass('off')){
                  if($(this.container).find('.video_hd').hasClass('mfp-icon-hd')){
                    $(this.container).find('.video_hd').attr('title',this.lang.activate+' '+this.lang.highdef);
                    $(this.container).find('.video_hd span').html(this.lang.activate+' '+this.lang.highdef);
                  }
                  else{
                    $(this.container).find('.video_hd').attr('title',this.lang.activate+' '+this.lang.lowdef);
                    $(this.container).find('.video_hd span').html(this.lang.activate+' '+this.lang.lowdef);
                  }
                    this.options.last_video='.video_hd';
                }
                $(this.container).find('.video_hd').addClass('off');
                if(!$(this.container).find('.video_signed').hasClass('off')){
                    this.options.last_video='.video_signed';
                    $(this.container).find('.video_signed').attr('title',this.lang.activate+' '+this.lang.signed);
                    $(this.container).find('.video_signed span').html(this.lang.activate+' '+this.lang.signed);
                }
                $(this.container).find('.video_signed').addClass('off');
                btn.removeClass('off');
                this.videoPlayer.getCurrentTime().then((time)=>{
                    this.videoPlayer.getPaused().then((paused)=>{
                        this.videoPlayer.pause();
                        this.changeSource(this.options.videos.audiodesc).then(()=>{
                            console.log("SOURCE CHANGED 2");
                            this.videoPlayer.on('canplay', (event)=>{
                                this.videoPlayer.setCurrentTime(time);
                                if(!paused){
                                    this.videoPlayer.play();
                                }
                                this.videoPlayer.off('canplay');
                            });
                        });
                    });
                });
            }
            else{
                $(this.container).find(this.options.last_video).trigger('click');
            }
        });

        $(this.container).find('.video_signed').click(()=>{
            var btn = $(this.container).find('.video_signed');
            btn.attr('title',this.lang.desactivate+' '+this.lang.signed);
            btn.find('span').html(this.lang.desactivate+' '+this.lang.signed);
            if(btn.hasClass('off')){
                if(!$(this.container).find('.video_hd').hasClass('off')){
                  if($(this.container).find('.video_hd').hasClass('mfp-icon-hd')){
                    $(this.container).find('.video_hd').attr('title',this.lang.activate+' '+this.lang.highdef);
                    $(this.container).find('.video_hd span').html(this.lang.activate+' '+this.lang.highdef);
                  }
                  else{
                    $(this.container).find('.video_hd').attr('title',this.lang.activate+' '+this.lang.lowdef);
                    $(this.container).find('.video_hd span').html(this.lang.activate+' '+this.lang.lowdef);
                  }
                    this.options.last_video='.video_hd';
                }
                $(this.container).find('.video_hd').addClass('off');
                if(!$(this.container).find('.video_audiodesc').hasClass('off')){
                    this.options.last_video='.video_audiodesc';
                    $(this.container).find('.video_audiodesc').attr('title',this.lang.activate+' '+this.lang.audiodesc);
                    $(this.container).find('.video_audiodesc span').html(this.lang.activate+' '+this.lang.audiodesc);
                }
                $(this.container).find('.video_audiodesc').addClass('off');
                btn.removeClass('off');
                this.videoPlayer.getCurrentTime().then((time)=>{
                    this.videoPlayer.getPaused().then((paused)=>{
                        this.videoPlayer.pause();
                        this.changeSource(this.options.videos.signed).then(()=>{
                            console.log("SOURCE CHANGED 3");
                            this.videoPlayer.on('canplay', (event)=>{
                                this.videoPlayer.setCurrentTime(time);
                                if(!paused){
                                    this.videoPlayer.play();
                                }
                                this.videoPlayer.off('canplay');
                            });
                        });
                    });
                });
            }
            else{
                $(this.container).find(this.options.last_video).trigger('click');
            }
        });

    }

    initTranscripts(){
        var btn = $(this.container).find('.right-part .transcripts-block .transcripts');
        btn.click(function(){
            $(this.container).find('.right-part .transcripts-block .menu').dialog( "open" );
        }.bind(this));
        var menu = $(this.container).find('.right-part .transcripts-block .menu');
        $(menu[0]).append(men);
        if(this.options.live!=''){
            var men = $('<li class="mfp_live" ><span class="mfp-icon-live">'+this.lang.activateLiveTranscript+'</span></li>');
            $(menu[0]).append(men);
        }
        if(this.options.transcripts.html!='' && typeof this.options.transcripts.html !== "undefined"){
            var men = $('<li class="" data-src="'+this.options.transcripts.html+'"><span class="mfp-icon-html">'+this.lang.transcript+' HTML</span></li>');
            $(menu[0]).append(men);
        }
        if(this.options.transcripts.txt!='' && typeof this.options.transcripts.txt !== "undefined"){
            var men = $('<li class="" data-src="'+this.options.transcripts.txt+'"><span class="mfp-icon-txt">'+this.lang.transcript+' TXT</span></li>');
            $(menu[0]).append(men);
        }
        var m = new MFP_Menu($(menu[0]),{
            select:function(elmt){
                if($(elmt).hasClass('mfp_live')){
                    if($(this.container).find('.right-part .transcripts-block .transcripts').hasClass('off')){
                        $(this.container).find('.right-part .transcripts-block .transcripts').removeClass('off');
                        $(elmt).find('span').html(this.lang.desactivateLiveTranscript);
                        this.liveOn=true;
                    }
                    else{
                        $(this.container).find('.right-part .transcripts-block .transcripts').addClass('off');
                        $(elmt).find('span').html(this.lang.activateLiveTranscript);
                        this.liveOn=false;
                    }
                    this.updateLive();
                }
                else{
                    var vsrc = $(elmt).data('src');
                    window.open(vsrc);
                    $(this.container).find('.right-part .transcripts-block .menu').dialog( "close" );
                }
            }.bind(this)
        });
        m.init();
        /*
        $(menu[0]).menu({role:'listbox',select: function( event, ui ) {
            if(ui.item.hasClass('svp_live')){
                if($(this.container).find('.right-part .transcripts-block .transcripts').hasClass('off')){
                    $(this.container).find('.right-part .transcripts-block .transcripts').removeClass('off')
                    ui.item.find('span').html(this.lang.desactivateLiveTranscript);
                    this.liveOn=true;
                }
                else{
                    $(this.container).find('.right-part .transcripts-block .transcripts').addClass('off')
                    ui.item.find('span').html(this.lang.activateLiveTranscript);
                    this.liveOn=false;
                }
                this.updateLive();
            }
            else{
                var vsrc = ui.item.data('src');
                window.open(vsrc);
                $(this.container).find('.right-part .transcripts-block .menu').dialog( "close" );
            }
            //ui.item.css('background','green');
            //console.log();
        }.bind(this)});
        */
        $(menu[0]).dialog({ autoOpen: false, resizable: false,closeText: this.lang.close, position: { my: "right+30 bottom", at: "left top", of: btn } });
        $(menu[0]).dialog({
          appendTo: $(this.container).find('.right-part .transcripts-block')
        });

    }

    initPlayBackSpeedEvents(){
        $(this.container).find('.speed').on('change',function(e){
            var speed = $(this.container).find('.speed')[0].value;
            this.videoPlayer.setPlaybackRate(speed);
        }.bind(this));
    }

    initPlayEvents(){
        $(this.container).find('.play').click(function(e){
            e.preventDefault();
            console.log("PLAY");
            this.videoPlayer.getPaused().then((paused)=>{
                console.log(paused);
                if(paused){
                    this.videoPlayer.play();
                }else{
                    this.videoPlayer.pause();
                }
            });
        }.bind(this));
    }

    progressEvents(){
        var progress = $(this.controlBar).find('.progress-bar');
        progress.on('slide', ()=>{
            this.seekUpdate();
        });
        //progress.on('click',function(){console.log('click');});
        //progress.on('slidestart',function(){console.log('start');});
        progress.on('slidestart', ()=>{
            this.videoPlayer.getPaused().then((paused)=>{
                this.current_play=paused;
                this.videoPlayer.pause();
                this.redrawCues();
                this.updateLive();
                this.seeking=true;
                if(MFPDebug){
                  console.log('pausing video');
                }
                this.seekUpdate();
            });
        });
        progress.on('slidestop', ()=>{
            this.seekUpdate();
            if(!this.current_play){
                this.videoPlayer.play();
                this.redrawCues();
                this.updateLive();
                if(MFPDebug){
                  console.log('playing video');
              }
            }
            this.seeking=false;
        });
        //progress.on('update',function(){this.seekUpdate();}.bind(this));

        progress.on('keydown', (e) => {
            this.videoPlayer.getCurrentTime().then((time)=>{
                if(e.which==37 || e.which==40){
                    e.preventDefault();
                    //back 5 seconds;
                    if((time-5)>0){
                        this.videoPlayer.setCurrentTime(time-5);
                    }
                    else{
                        this.videoPlayer.setCurrentTime(0);
                    }
                }else if(e.which==38 || e.which==39){
                    e.preventDefault();
                    //forward 5 seconds ;
                    this.videoPlayer.getDuration().then((duration)=>{
                        if((time+5)>duration){
                            this.videoPlayer.setCurrentTime(duration);
                        }
                        else{
                            this.videoPlayer.setCurrentTime(time+5);
                        }
                    });
                }
            });
        });
    }

    seekUpdate(){
        return new Promise((resolve, reject)=>{
            this.videoPlayer.getDuration().then((duration)=>{
                let currentTime = (duration * $(this.controlBar).find('.progress-bar').slider('option',"value"))/100;
                this.videoPlayer.setCurrentTime(currentTime);
                resolve();
            });
        });
    }

    soundUpdate(e){
        const videoPlayer = this.videoPlayer;
        videoPlayer.setVolume($(this.container).find('.sound-range').slider('option','value') / 100);
        var h = this.soundBar.find('.ui-slider-handle');
        videoPlayer.getVolume().then((volume)=>{
            h.attr('aria-valuenow', volume * 100);
            h.attr('aria-valuetext', Math.round(volume *100)+'% '+this.lang.volume);

            if(volume >= 0.5){
                $(this.container).find('.sound').removeClass('mfp-icon-volume-mute').removeClass('mfp-icon-volume-down').addClass('mfp-icon-volume-up');
            }
            else if(volume > 0){
                $(this.container).find('.sound').removeClass('mfp-icon-volume-mute').removeClass('mfp-icon-volume-up').addClass('mfp-icon-volume-down');
            }else{
                $(this.container).find('.sound').removeClass('mfp-icon-volume-down').removeClass('mfp-icon-volume-up').addClass('mfp-icon-volume-mute');
            }
        });
    }

    initSoundEvents(){
        $(this.container).find('.sound-range').on('slide',function(){this.soundUpdate();}.bind(this));
        $(this.container).find('.sound-range').on('slidechange',function(){this.soundUpdate();}.bind(this));
        $(this.container).find('.sound').click(()=>{
            var sound_btn = $(this.container).find('.sound');
            this.videoPlayer.getVolume().then((volume)=>{
              if(volume>0){
                  sound_btn.attr('old_snd', volume);
                  $(this.container).find('.sound-range').slider('option','value',0);
                  sound_btn.find('span').html(this.lang.soundOn);
                  sound_btn.attr('title',this.lang.soundOn);
                  this.soundUpdate();
              }
              else{
                  this.videoPlayer.setVolume(sound_btn.attr('old_snd'));
                  $(this.container).find('.sound-range').slider('option','value',sound_btn.attr('old_snd')*100);
                  sound_btn.find('span').html(this.lang.soundOff);
                  sound_btn.attr('title',this.lang.soundOff);
                  this.soundUpdate();
              }
            });
        });
    }

    initDuration(){
        this.videoPlayer.getDuration().then((duration)=>{
            duration = Math.round(duration);
            if(!isNaN(duration)){
                var tmp = duration;
                var hr = 0;
                var min = 0;
                var minute = 0;
                var sec = 0;
                var dura = '';
                sec = tmp%60;
                min = ((tmp - sec) / 60)%60;
                minute = ((tmp - sec) / 60);
                hr = (tmp - sec - 60 * min) / 3600;
                if(hr > 0){
                    dura=hr+':';
                }
                if(sec < 10){
                    sec = '0' + sec;
                }
                if(min < 10 && hr > 0){
                    min = '0' + min;
                }
                dura=dura+min+':'+sec;
                $(this.container).find('.timer-duration').html(dura);
                this.duration = dura;
            }
        });
    }

    initFullScreenEvents(){
        // event for iphone/ipad to display standar subtitle on fullscreen :
        this.videoPlayer.on('webkitbeginfullscreen',function(){
          if(MFPDebug){
              console.log('iPhone/iPad going fullscreen');
          }
            for(var i=0;i<this.subtitles.length;i++){
                if(this.subtitles[i].track.mode2=='showing'){
                    this.subtitles[i].track.mode='showing';
                }
            }
            $(this.container).addClass('showcue');
        }.bind(this));
            this.videoPlayer.on('webkitendfullscreen',function(){
            if(MFPDebug){
                console.log('iPhone/iPad leaving fullscreen');
                this.videoPlayer.getTextTracks().then((tracks)=>{
                    console.log(tracks);
                });
            }
            for(var i=0;i<this.subtitles.length;i++){
                if(this.subtitles[i].track.mode=='showing'){
                    this.subtitles[i].track.mode2='showing';
                }
                else{
                    this.subtitles[i].track.mode2='hidden';
                }
                this.subtitles[i].track.mode='hidden';
            }
            // updating subtitles menu when not un fullscreen:
            var no_sub = true;
            $(this.container).find('.right-part .subtitles-block .menu li').removeClass('selected');
            var menus = $(this.container).find('.right-part .subtitles-block .menu li');
            for(var i=0;i<menus.length;i++){
                var men = $(menus[i]);
                if(!men.hasClass('preferences') && !men.hasClass('no-subtitles')){
                    var id = men.data('id');
                    if(this.subtitles[id].track.mode2=='showing'){
                        men.addClass('selected');
                        no_sub=false;
                    }
                }
            }
            if(no_sub){
                $(this.container).find('.right-part .subtitles-block .menu li.no-subtitles').addClass('selected');
            }

            $(this.container).removeClass('showcue');
            this.redrawCues();
        }.bind(this));

        //standard event
        var container = this.container;
        $(this.container).find('.expand').click(function(){
            if($(this.container).find('.expand').hasClass('mfp-icon-expand')){
                if ($(this.container)[0].requestFullscreen) {
                    $(this.container)[0].requestFullscreen();
                    document.addEventListener("fullscreenchange",function(e){
                        if(document.fullscreen){
                            $(this.container).find('expand').removeClass('mfp-icon-expand').addClass('mfp-icon-compress').attr('aria-label',this.lang.compress);
                            $(this.container).addClass('fullscreen');
                            this.fontSize();
                        }
                        else{
                            document.removeEventListener('fullscreenchange',arguments.callee);
                            $(this.container).find('.expand').removeClass('mfp-icon-compress').addClass('mfp-icon-expand').attr('aria-label',this.lang.expand);
                            $(this.container).removeClass('fullscreen');
                        }
                    }.bind(this));
                } else if ($(this.container)[0].webkitRequestFullscreen) {
                    $(this.container)[0].webkitRequestFullscreen();
                    document.addEventListener("webkitfullscreenchange",function(e){
                        if(document.webkitIsFullScreen){
                            $(this.container).find('.expand').removeClass('mfp-icon-expand').addClass('mfp-icon-compress').attr('aria-label',this.lang.compress);
                            $(this.container).addClass('fullscreen');
                            this.fontSize();
                        }
                        else{
                            $(this.container).find('.expand').removeClass('mfp-icon-compress').addClass('mfp-icon-expand').attr('aria-label',this.lang.expand);
                            document.removeEventListener('webkitfullscreenchange',arguments.callee);
                            $(this.container).removeClass('fullscreen');
                        }

                    }.bind(this));
                } else if ($(this.container)[0].mozRequestFullScreen) {
                    $(this.container)[0].mozRequestFullScreen();
                    document.addEventListener("mozfullscreenchange",function(e){
                         if(document.mozFullScreen){
                            $(this.container).find('.expand').removeClass('mfp-icon-expand').addClass('mfp-icon-compress').attr('aria-label',this.lang.compress);
                            $(this.container).addClass('fullscreen');
                            this.fontSize();
                        }
                        else{
                            document.removeEventListener('mozfullscreenchange',arguments.callee);
                            $(this.container).find('.expand').removeClass('mfp-icon-compress').addClass('mfp-icon-expand').attr('aria-label',this.lang.expand);
                            $(this.container).removeClass('fullscreen');
                        }
                    }.bind(this));
                } else if ($(this.container)[0].msRequestFullscreen) {
                    $(this.container)[0].msRequestFullscreen();
                    document.addEventListener("MSFullscreenChange",function(e){
                         if(document.msFullScreen){
                            $(this.container).find('.expand').removeClass('mfp-icon-expand').addClass('mfp-icon-compress').attr('aria-label',this.lang.compress);
                            $(this.container).addClass('fullscreen');
                            this.fontSize();
                        }
                        else{
                            document.removeEventListener('MSFullscreenChange',arguments.callee);
                            $(this.container).find('.expand').removeClass('mfp-icon-compress').addClass('mfp-icon-expand').attr('aria-label',this.lang.expand);
                            $(this.container).removeClass('fullscreen');
                        }
                    }.bind(this));
                }
                else{
                    // none of the events work so we are on mobile or tablet, so asking fullscreen on the video directly
                    this.videoPlayer.webkitEnterFullscreen();
                }
            }
            else{
                $(this.container).removeClass('showcue');
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }.bind(this));
    }
}
