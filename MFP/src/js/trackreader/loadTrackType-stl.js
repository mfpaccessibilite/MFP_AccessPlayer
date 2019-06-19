/**
 * MFP AccessPlayer v.1.0
 * http://smartplayer.mfpst.com
 *
 * Extention to READ track in STL fileformat
 *
 * Copyright MFP Multimedia France Productions
 * Released under GPL 3 licence
 * backgroundImage: "key"
 * Date : 2017-10-19T06:48Z
 */
import MFP_Cue from '../lib/MFP_Cue';

$('head').append('<link rel="stylesheet" href="'+mfpPath+'trackreader/stl.css" type="text/css" />');
MFP.prototype.loadTrackTypeSTL=function(player,filepath,track){
    Number.prototype.padLeft = function (n,str){
        return Array(n-String(this).length+1).join(str||'0')+this;
    };
    var parser={
        player:null,
        track:null,
        render:function(filepath){
            var parser = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', filepath, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) {
                if (xhr.status != 200) {
                    // error loading:
                    parser.track.mode=disabled;
                    parser.player.subtitles.splice($(parser.track).data('pos'),1);
                    parser.player.initSubtitlesMenu();
                }
                else{
                    parser.track.mode='hidden';
                    //parser.track.readyState=2;
                    var arrayBuffer = xhr.response;
                    var byteArray = new Uint8Array(arrayBuffer);
                    var gsi = byteArray.subarray(0, 1024);
                    //console.log(gsi);
                    var dfc = parser.UInt8ArrayToString(gsi.subarray(3,11));
                    var cpn = parser.UInt8ArrayToString(gsi.subarray(0,3));
                    var cct = parser.UInt8ArrayToString(gsi.subarray(12,14));
                    var lc = parser.UInt8ArrayToString(gsi.subarray(14,16));
                    var mnr = parser.UInt8ArrayToString(gsi.subarray(253,255));
                    var tcp = parser.UInt8ArrayToString(gsi.subarray(256,264));
                    if(dfc=='STL25.01'){
                        var imsec=25;
                    }
                    else{
                        var imsec=30;
                    }
                    for(let i=1024;i<byteArray.length;i=i+128){
                        var tti = byteArray.subarray(i,i+128);
                        var group = tti.subarray(0,1);
                        var num = tti.subarray(1,3);
                        var ebn = tti.subarray(3,4);
                        var cs = tti.subarray(4,5);
                        var tci = tti.subarray(5,9);
                        var tco = tti.subarray(9,13);
                        var vp = tti.subarray(13,14);
                        var jc = tti.subarray(14,15);
                        var cf = tti.subarray(15,16);
                        var tf = tti.subarray(16,128);
                        var tcit = (parser.byteArrayToLong(tci.subarray(0,1))*60*60)+(parser.byteArrayToLong(tci.subarray(1,2))*60)+parser.byteArrayToLong(tci.subarray(2,3))+(parseInt((parseInt(parser.byteArrayToLong(tci.subarray(3,4)))/imsec)*1000)/1000);
                        var tcot = (parser.byteArrayToLong(tco.subarray(0,1))*60*60)+(parser.byteArrayToLong(tco.subarray(1,2))*60)+parser.byteArrayToLong(tco.subarray(2,3))+(parseInt((parseInt(parser.byteArrayToLong(tco.subarray(3,4)))/imsec)*1000)/1000);
                        //var tcot = parser.byteArrayToLong(tco.subarray(0,1)).padLeft(2)+':'+parser.byteArrayToLong(tco.subarray(1,2)).padLeft(2)+':'+parser.byteArrayToLong(tco.subarray(2,3)).padLeft(2)+'.'+parser.padLeft(parseInt((parseInt(parser.byteArrayToLong(tco.subarray(3,4)))/imsec)*1000),3)
                        var txt = parser.n19totext.render(tf,cct);
                        var line=Math.floor(parser.byteArrayToLong(vp));
                        if(line>=20){
                            line=-1;
                        }
                        jc=parser.byteArrayToLong(jc);
                        //console.log(tcit);
                        var cue = new MFP_Cue(tcit,tcot,txt);
                        if(jc==1){
                            cue.align='start';
                        } else if(jc==3){
                            cue.align='end';
                        }
                        cue.line=line;
                        cue.id=parser.byteArrayToLong(num);
                        parser.track.addCue(cue);
                    }
                    parser.player.loadedTrack(parser.track);
                    //parser.player.initSubtitlesMenu();
                }
            };
            xhr.send(null);
        },
        padLeft:function(nr, n, str){
            return Array(n-String(nr).length+1).join(str||'0')+nr;
        },
        UInt8ArrayToString:function(uarray){
            var myString = '';
            for (var i=0; i<uarray.byteLength; i++) {
                myString += String.fromCharCode(uarray[i]);
            }
            return myString;
        },
        byteArrayToLong:function(/*byte[]*/byteArray) {
            var value = 0;
            for ( var i = byteArray.length - 1; i >= 0; i--) {
                value = (value * 256) + byteArray[i];
            }

            return value;
        },
        UInt8ArrayToInt:function(uarray){
            var myString = '';
            for (var i=0; i<uarray.byteLength; i++) {
                myString += String.fromCharCode(uarray[i]);
            }
            return myString;
        },
        stringToBytes:function( str ) {
          var ch, st, re = [];
          for (var i = 0; i < str.length; i++ ) {
            ch = str.charCodeAt(i);  // get char
            st = [];                 // set up "stack"
            do {
              st.push( ch & 0xFF );  // push byte to stack
              ch = ch >> 8;          // shift value down by 1 byte
            }
            while ( ch );
            // add stack contents to result
            // done because chars have "wrong" endianness
            re = re.concat( st.reverse() );
          }
          // return an array of bytes
          return re;
        },
        n19totext:{
            modifier: '',
            last: '',
            doubleline : false,
            color: '',
            bgcolor: '',
            countOpen:0,
            get_char : function(t){
                this.last=t;
                if(this.modifier!=''){
                    var ret = '&'+t+this.modifier+';';
                    var temp= document.createElement('p');
                    temp.innerHTML= ret;
                    var str= temp.textContent || temp.innerText;
                    temp=null;
                    this.modifier='';
                    return str;
                }
                else{
                    return t;
                }
            },
            add_br:function(){
                if(!this.doubleline){
                    return '\n';
                }
                else{
                    if(this.last=='<br />'){
                        this.last='';

                        return "\n";
                    }
                    else{
                        this.last='<br />';
                        return '';
                    }
                }
            },
            closeAllTags:function(){
                var text ='';
                if(this.italic){
                    this.italic=false;
                    text+='</i>';
                }
                if(this.strong){
                    this.strong=false;
                    text+='</strong>';
                }
                if(this.under){
                    this.under=false;
                    text+='</u>';
                }
                for(var i =0; i<this.countOpen>0; i++){
                    text+='</c>';
                }
                this.countOpen=0;
                return text;
            },
            closeTags:function(){
                var text ='';

                if(this.countOpen>0){
                    if(this.italic){
                        text+='</i>';
                    }
                    if(this.strong){
                        text+='</strong>';
                    }
                    if(this.under){
                        text+='</u>';
                    }
                    text+='</c>';
                    this.countOpen--;
                }

                return text;
            },
            openTag: function(){
                var text = '';
                //text=this.closeTags();
                if(this.color!='' || this.bgcolor!='' || this.doubleline!=''){
                    text = '<c';
                    if(this.color!=''){
                        text+='.mfp-ac-'+this.color;
                    }
                    if(this.bgcolor!=''){
                        text+='.mfp-bgc-'+this.color;
                    }
                    if(this.doubleline!=''){
                        text+='.mfp-lh';
                    }
                    text+='>';
                    this.countOpen++;
                }
                if(this.italic || this.strong || this.under){
                    if(this.italic){
                        text+='<i>';
                    }
                    if(this.strong){
                        text+='<strong>';
                    }
                    if(this.under){
                        text+='<u>';
                    }
                }
                return text;
            },
            render: function(n19, cct){
                this.last='';
                this.doubleline=false;
                this.italic=false;
                this.strong=false;
                this.under=false;
                var text = '';
                var text2 = '';
                var text3 = '';
                text = this.openTag();
                var last2 = '';
                for(var i=0;i<n19.length;i++){
                  //text = text + toHexString(n19.substring(i,i+1));
                  var t = n19[i].toString(16).toUpperCase();
                  if(t.length==1){
                      t = '0'+t;
                  }
                  let last=t;
                  text2+=' '+t;
                  if(cct=='00'){
                    // Latin Alphabet
                    switch (t) {
                        case '00' :
                            text = text + this.closeTags();
                            this.color='black';
                            text = text + this.openTag();
                            break;
                        case '01' :
                            text = text + this.closeTags();
                            this.color='red';
                            text = text + this.openTag();
                            break;
                        case '02' :
                            text = text + this.closeTags();
                            this.color='green';
                            text = text + this.openTag();
                            break;
                        case '03' :
                            text = text + this.closeTags();
                            this.color='yellow';
                            text = text + this.openTag();
                            break;
                        case '04' :
                            text = text + this.closeTags();
                            this.color='blue';
                            text = text + this.openTag();
                            break;
                        case '05' :
                            text = text + this.closeTags();
                            this.color='magenta';
                            text = text + this.openTag();
                            break;
                        case '06' :
                            text = text + this.closeTags();
                            this.color='cyan';
                            text = text + this.openTag();
                            break;
                        case '07' :
                            text = text + this.closeTags();
                            this.color='white';
                            text = text + this.openTag();
                            break;
                        case '0A' :
                            if(last=='0A'){
                                text=text+this.closeTags();
                               //text = text + '</div>';
                            }
                            break;
                        case '0B' :
                            if(last=='0B' && text3!=''){
                                if(last2=='0B'){
                                    text=text+this.closeAllTags();
                                    text = text + "\n";
                                    text=text+this.openTag();
                                    text3='';
                                    last2='';
                                }
                                else{
                                    last2='0B';
                                }
                                //text = text + '<div>';

                            }
                            //text = text + '<br />';
                            break;
                        case '0D' :
                            text = text + this.closeTags();
                            this.doubleline=true;
                            text = text + this.openTag();
                            break;
                        case '0C' :
                            text = text + this.closeTags();
                            this.doubleline=false;
                            text = text + this.openTag();
                            break;
                        case '20' : text = text + this.get_char(' ');break;
                        case '21' : text = text + this.get_char('!');text3+=' ';break;
                        case '22' : text = text + this.get_char('"');text3+=' ';break;
                        case '23' : text = text +this.get_char('#');text3+=' ';break;
                        case '24' : text = text +this.get_char('¤');text3+=' ';break;
                        case '25' : text = text +this.get_char('%');text3+=' ';break;
                        case '26' : text = text +this.get_char('&');text3+=' ';break;
                        case '27' : text = text +this.get_char('\'');text3+=' ';break;
                        case '28' : text = text +this.get_char('(');text3+=' ';break;
                        case '29' : text = text +this.get_char(')');text3+=' ';break;
                        case '2A' : text = text +this.get_char('*');text3+=' ';break;
                        case '2B' : text = text +this.get_char('+');text3+=' ';break;
                        case '2C' : text = text +this.get_char(',');text3+=' ';break;
                        case '2D' : text = text +this.get_char('-');text3+=' ';break;
                        case '2E' : text = text +this.get_char('.');text3+=' ';break;
                        case '2F' : text = text +this.get_char('/');text3+=' ';break;

                        case '30' : text = text +this.get_char('0');text3+=' ';break;
                        case '31' : text = text +this.get_char('1');text3+=' ';break;
                        case '32' : text = text +this.get_char('2');text3+=' ';break;
                        case '33' : text = text +this.get_char('3');text3+=' ';break;
                        case '34' : text = text +this.get_char('4');text3+=' ';break;
                        case '35' : text = text +this.get_char('5');text3+=' ';break;
                        case '36' : text = text +this.get_char('6');text3+=' ';break;
                        case '37' : text = text +this.get_char('7');text3+=' ';break;
                        case '38' : text = text +this.get_char('8');text3+=' ';break;
                        case '39' : text = text +this.get_char('9');text3+=' ';break;
                        case '3A' : text = text +this.get_char(':');text3+=' ';break;
                        case '3B' : text = text +this.get_char(';');text3+=' ';break;
                        case '3C' : text = text +this.get_char('<');text3+=' ';break;
                        case '3D' : text = text +this.get_char('=');text3+=' ';break;
                        case '3E' : text = text +this.get_char('>');text3+=' ';break;
                        case '3F' : text = text +this.get_char('?');text3+=' ';break;

                        case '40' : text = text +this.get_char('@');text3+=' ';break;
                        case '41' : text = text +this.get_char('A');text3+=' ';break;
                        case '42' : text = text +this.get_char('B');text3+=' ';break;
                        case '43' : text = text +this.get_char('C');text3+=' ';break;
                        case '44' : text = text +this.get_char('D');text3+=' ';break;
                        case '45' : text = text +this.get_char('E');text3+=' ';break;
                        case '46' : text = text +this.get_char('F');text3+=' ';break;
                        case '47' : text = text +this.get_char('G');text3+=' ';break;
                        case '48' : text = text +this.get_char('H');text3+=' ';break;
                        case '49' : text = text +this.get_char('I');text3+=' ';break;
                        case '4A' : text = text +this.get_char('J');text3+=' ';break;
                        case '4B' : text = text +this.get_char('K');text3+=' ';break;
                        case '4C' : text = text +this.get_char('L');text3+=' ';break;
                        case '4D' : text = text +this.get_char('M');text3+=' ';break;
                        case '4E' : text = text +this.get_char('N');text3+=' ';break;
                        case '4F' : text = text +this.get_char('O');text3+=' ';break;

                        case '50' : text = text +this.get_char('P');text3+=' ';break;
                        case '51' : text = text +this.get_char('Q');text3+=' ';break;
                        case '52' : text = text +this.get_char('R');text3+=' ';break;
                        case '53' : text = text +this.get_char('S');text3+=' ';break;
                        case '54' : text = text +this.get_char('T');text3+=' ';break;
                        case '55' : text = text +this.get_char('U');text3+=' ';break;
                        case '56' : text = text +this.get_char('V');text3+=' ';break;
                        case '57' : text = text +this.get_char('W');text3+=' ';break;
                        case '58' : text = text +this.get_char('X');text3+=' ';break;
                        case '59' : text = text +this.get_char('Y');text3+=' ';break;
                        case '5A' : text = text +this.get_char('Z');text3+=' ';break;
                        case '5B' : text = text +this.get_char('[');text3+=' ';break;
                        case '5C' : text = text +this.get_char('\\');text3+=' ';break;
                        case '5D' : text = text +this.get_char(']');text3+=' ';break;
                        case '5E' : text = text +this.get_char('^');text3+=' ';break;
                        case '5F' : text = text +this.get_char('_');text3+=' ';break;

                        case '60' : text = text +this.get_char('`');text3+=' ';break;
                        case '61' : text = text +this.get_char('a');text3+=' ';break;
                        case '62' : text = text +this.get_char('b');text3+=' ';break;
                        case '63' : text = text +this.get_char('c');text3+=' ';break;
                        case '64' : text = text +this.get_char('d');text3+=' ';break;
                        case '65' : text = text +this.get_char('e');text3+=' ';break;
                        case '66' : text = text +this.get_char('f');text3+=' ';break;
                        case '67' : text = text +this.get_char('g');text3+=' ';break;
                        case '68' : text = text +this.get_char('h');text3+=' ';break;
                        case '69' : text = text +this.get_char('i');text3+=' ';break;
                        case '6A' : text = text +this.get_char('j');text3+=' ';break;
                        case '6B' : text = text +this.get_char('k');text3+=' ';break;
                        case '6C' : text = text +this.get_char('l');text3+=' ';break;
                        case '6D' : text = text +this.get_char('m');text3+=' ';break;
                        case '6E' : text = text +this.get_char('n');text3+=' ';break;
                        case '6F' : text = text +this.get_char('o');text3+=' ';break;

                        case '70' : text = text +this.get_char('p');text3+=' ';break;
                        case '71' : text = text +this.get_char('q');text3+=' ';break;
                        case '72' : text = text +this.get_char('r');text3+=' ';break;
                        case '73' : text = text +this.get_char('s');text3+=' ';break;
                        case '74' : text = text +this.get_char('t');text3+=' ';break;
                        case '75' : text = text +this.get_char('u');text3+=' ';break;
                        case '76' : text = text +this.get_char('v');text3+=' ';break;
                        case '77' : text = text +this.get_char('w');text3+=' ';break;
                        case '78' : text = text +this.get_char('x');text3+=' ';break;
                        case '79' : text = text +this.get_char('y');text3+=' ';break;
                        case '7A' : text = text +this.get_char('z');text3+=' ';break;
                        case '7B' : text = text +this.get_char('{');text3+=' ';break;
                        case '7C' : text = text +this.get_char('|');text3+=' ';break;
                        case '7D' : text = text +this.get_char('}');text3+=' ';break;
                        case '7E' : text = text +this.get_char('~');text3+=' ';break;

                        case '80' : text = text + '<i>';this.italic=true;break;
                        case '81' : text = text + '</i>';this.italic=false;break;
                        case '82' : text = text + '<u>';this.under=true;break;
                        case '83' : text = text + '</u>';this.under=false;break;
                        case '84' : text = text + '<strong>';this.strong=true;break;
                        case '85' : text = text + '</strong>';this.strong=false;break;
                        case '8A' : text = text + this.add_br();text3+=' ';break;

                        case 'A0' : text = text +this.get_char('&nbsp;');text3+=' ';break;
                        case 'A1' : text = text +this.get_char('¡');text3+=' ';break;
                        case 'A2' : text = text +this.get_char('¢');text3+=' ';break;
                        case 'A3' : text = text +this.get_char('£');text3+=' ';break;
                        case 'A4' : text = text +this.get_char('$');text3+=' ';break;
                        case 'A5' : text = text +this.get_char('¥');text3+=' ';break;
                        case 'A6' : text = text +this.get_char('');text3+=' ';break;
                        case 'A7' : text = text +this.get_char('§');text3+=' ';break;
                        case 'A8' : text = text +this.get_char('');text3+=' ';break;
                        case 'A9' : text = text +this.get_char('`');text3+=' ';break;
                        case 'AA' : text = text +this.get_char('“');text3+=' ';break;
                        case 'AB' : text = text +this.get_char('«');text3+=' ';break;
                        case 'AC' : text = text +this.get_char('←');text3+=' ';break;
                        case 'AD' : text = text +this.get_char('↑');text3+=' ';break;
                        case 'AE' : text = text +this.get_char('→');text3+=' ';break;
                        case 'AF' : text = text +this.get_char('↓');text3+=' ';break;

                        case 'B0' : text = text +this.get_char('°');text3+=' ';break;
                        case 'B1' : text = text +this.get_char('±');text3+=' ';break;
                        case 'B2' : text = text +this.get_char('²');text3+=' ';break;
                        case 'B3' : text = text +this.get_char('³');text3+=' ';break;
                        case 'B4' : text = text +this.get_char('×');text3+=' ';break;
                        case 'B5' : text = text +this.get_char('µ');text3+=' ';break;
                        case 'B6' : text = text +this.get_char('¶');text3+=' ';break;
                        case 'B7' : text = text +this.get_char('•');text3+=' ';break;
                        case 'B8' : text = text +this.get_char('÷');text3+=' ';break;
                        case 'B9' : text = text +this.get_char('´');text3+=' ';break;
                        case 'BA' : text = text +this.get_char('”');text3+=' ';break;
                        case 'BB' : text = text +this.get_char('»');text3+=' ';break;
                        case 'BC' : text = text +this.get_char('¼');text3+=' ';break;
                        case 'BD' : text = text +this.get_char('½');text3+=' ';break;
                        case 'BE' : text = text +this.get_char('¾');text3+=' ';break;
                        case 'BF' : text = text +this.get_char('¿');text3+=' ';break;

                        case 'C0' : text = text +this.get_char('');text3+=' ';break;
                        case 'C1' : //text = text +this.get_char('`');break;
                            this.modifier='grave';break;
                        case 'C2' : //text = text +this.get_char('´');break;
                            this.modifier='acute';break;
                        case 'C3' : //text = text +this.get_char('^');break;
                            this.modifier='circ';break;
                        case 'C4' : //text = text +this.get_char('~');break;
                            this.modifier='tilde';break;
                        case 'C5' : text = text +this.get_char('¯');text3+=' ';break;
                        case 'C6' : text = text +this.get_char('˘');text3+=' ';break;
                        case 'C7' : text = text +this.get_char('˙');text3+=' ';break;
                        case 'C8' :// text = text +this.get_char('¨');break;
                            this.modifier='uml';break;
                        case 'C9' : text = text +this.get_char('');text3+=' ';break;
                        case 'CA' : text = text +this.get_char('˚');text3+=' ';break;
                        case 'CB' : //text = text +this.get_char('¸');break;
                            this.modifier='cedil';break;
                        case 'CC' : text = text +this.get_char('‑');text3+=' ';break;
                        case 'CD' : text = text +this.get_char('″');text3+=' ';break;
                        case 'CE' : //text = text +this.get_char('˛');break;
                            this.modifier='cedil';break;
                        case 'CF' : text = text +this.get_char('ˇ');text3+=' ';break;

                        case 'D0' : text = text +this.get_char('—');text3+=' ';break;
                        case 'D1' : text = text +this.get_char('¹');text3+=' ';break;
                        case 'D2' : text = text +this.get_char('®');text3+=' ';break;
                        case 'D3' : text = text +this.get_char('©');text3+=' ';break;
                        case 'D4' : text = text +this.get_char('™');text3+=' ';break;
                        case 'D5' : text = text +this.get_char('♪');text3+=' ';break;
                        case 'D6' : text = text +this.get_char('⁊');text3+=' ';break;
                        case 'D7' : text = text +this.get_char('¦');text3+=' ';break;
                        case 'D8' : text = text +this.get_char('');text3+=' ';break;
                        case 'D9' : text = text +this.get_char('');text3+=' ';break;
                        case 'DA' : text = text +this.get_char('');text3+=' ';break;
                        case 'DB' : text = text +this.get_char('');text3+=' ';break;
                        case 'DC' : text = text +this.get_char('⅛');text3+=' ';break;
                        case 'DD' : text = text +this.get_char('⅜');text3+=' ';break;
                        case 'DE' : text = text +this.get_char('⅝');text3+=' ';break;
                        case 'DF' : text = text +this.get_char('⅞');text3+=' ';break;

                        case 'E0' : text = text +this.get_char('Ω');text3+=' ';break;
                        case 'E1' : text = text +this.get_char('Æ');text3+=' ';break;
                        case 'E2' : text = text +this.get_char('Ð');text3+=' ';break;
                        case 'E3' : text = text +this.get_char('ạ');text3+=' ';break;
                        case 'E4' : text = text +this.get_char('Ħ');text3+=' ';break;
                        case 'E5' : text = text +this.get_char('');text3+=' ';break;
                        case 'E6' : text = text +this.get_char('Ĳ');text3+=' ';break;
                        case 'E7' : text = text +this.get_char('Ŀ');text3+=' ';break;
                        case 'E8' : text = text +this.get_char('Ł');text3+=' ';break;
                        case 'E9' : text = text +this.get_char('Ø');text3+=' ';break;
                        case 'EA' : text = text +this.get_char('Œ');text3+=' ';break;
                        case 'EB' : text = text +this.get_char('ọ');text3+=' ';break;
                        case 'EC' : text = text +this.get_char('Þ');text3+=' ';break;
                        case 'ED' : text = text +this.get_char('Ŧ');text3+=' ';break;
                        case 'EE' : text = text +this.get_char('Ŋ');text3+=' ';break;
                        case 'EF' : text = text +this.get_char('ŉ');text3+=' ';break;


                        case 'F0' : text = text +this.get_char('ĸ');text3+=' ';break;
                        case 'F1' : text = text +this.get_char('æ');text3+=' ';break;
                        case 'F2' : text = text +this.get_char('đ');text3+=' ';break;
                        case 'F3' : text = text +this.get_char('#');text3+=' ';break; // <============
                        case 'F4' : text = text +this.get_char('ħ');text3+=' ';break;
                        case 'F5' : text = text +this.get_char('%');text3+=' ';break;
                        case 'F6' : text = text +this.get_char('ĳ');text3+=' ';break;
                        case 'F7' : text = text +this.get_char('ŀ');text3+=' ';break;
                        case 'F8' : text = text +this.get_char('ł');text3+=' ';break;
                        case 'F9' : text = text +this.get_char('ø');text3+=' ';break;
                        case 'FA' : text = text +this.get_char('œ');text3+=' ';break;
                        case 'FB' : text = text +this.get_char('ß');text3+=' ';break;
                        case 'FC' : text = text +this.get_char('þ');text3+=' ';break;
                        case 'FD' : text = text +this.get_char('ŧ');text3+=' ';break;
                        case 'FE' : text = text +this.get_char('ŋ');text3+=' ';break;
                        case 'FF' : text = text +this.get_char('­');text3+=' ';break;
                        default:
                            true;
                    }

                }
            }
            text +=this.closeTags();
            text +=this.closeTags();
            return text;
            }
        }
    };

    parser.player=player;
    parser.track=track;
    parser.render(filepath);
    console.log('Trying to load '+filepath+' with FileTrack Loader .src');


};
console.log('STL reader added');
