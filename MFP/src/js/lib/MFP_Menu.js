/**
 * MFP AccessPlayer v.1.0.2
 * http://smartplayer.mfpst.com
 *
 * Copyright MFP Multimedia France Productions
 * Released under GPL 3 licence
 * backgroundImage: "key"
 * Date : 2018-10-16T14:58Z
 */
 
export default class MFP_Menu {

  constructor(){
      var element = arguments[0];
      if(arguments.length > 1){
          var options = arguments[1];
      }
      else{
          var options = {};
      }
      this.element = $(element);
      this.options = options;
      this.default_options = {
          select:function(elmt){}
      };
      $.extend( {}, this.default_options, this.options );
  }

  init(){
      this.prepareContent();
  }

  prepareContent(){
      this.element.attr('role','menu').addClass('mfp_list').attr('tabindex','0');
      this.element.on('focus',function(){
          if($(this).find('li.selected').length>0){
              $(this).find('li.selected').focus();
          }
          else{
              $(this).find('li:first-child').focus();
          }
      });
      this.element.find('li').attr('role','menuitem').attr('tabindex','-1');
      this.element.find('li').on('focus',function(e){
          $(this).addClass('focus');
      });
      this.element.find('li').on('blur',function(e){
          $(this).removeClass('focus');
      });
      this.element.find('li').click(function(e){
          var that = e.currentTarget;
          $(that).parent().find('li').removeAttr('aria-selected');
          $(that).parent().find('li').removeClass('selected');
          $(that).addClass('selected');
          $(that).attr('aria-selected','true');
          this.options.select(that);
      }.bind(this));
      this.element.find('li').on('keydown',function(e){
          var that = e.currentTarget;
          if(e.which==38){ //up
              if($(that).prev().length>0){
                  $(that).prev().focus();
              }
              else{
                  $(that).parent().find('li:last-child').focus();
              }

          }
          else if(e.which==40){ //down
              if($(that).next().length>0){
                  $(that).next().focus();
              }
              else{
                  $(that).parent().find('li:first-child').focus();
              }
          }
          else if(e.which == 9){ // tab
              e.preventDefault();
              $(that).parent().parent().find('.ui-dialog-titlebar button').focus();
          }
          else if(e.which == 13){ // enter
              e.preventDefault();
              $(that).parent().find('li').removeAttr('aria-selected');
              $(that).parent().find('li').removeClass('selected');
              $(that).addClass('selected');
              $(that).attr('aria-selected','true');
              this.options.select(that);

          }

      }.bind(this));
   }

};
