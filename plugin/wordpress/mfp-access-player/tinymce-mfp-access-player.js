(function() {
	var called = false;
	tinymce.PluginManager.add( 'mfp_access_player', function( editor, url ) {
		// Add Button to Visual Editor Toolbar
		editor.addButton('mfp_access_player', {
			title: 'Insert MFP Access Player',
			image: url + '/icon.png',			
			cmd: 'mfp_access_player',
		});
		editor.on('BeforeSetcontent', function(e){
		//editor.onBeforeSetContent.add(function(ed, o) {
			//o.content = mfpsp_do_spot(o.content);
			e.content = mfpsp_do_spot(e.content);
		});
		editor.on('PostProcess',function(e) {
		//editor.onPostProcess.add(function(ed, o) {
			//if(o.get){
			//	o.content = mfpsp_get_spot(o.content);
			//}
			if(e.get){
				e.content = mfpsp_get_spot(e.content);
			}
		});
		editor.on('ExecCommand',function(e) {
		//editor.onExecCommand.add(function(ed, cmd) {
			//if (cmd ==='mceInsertContent'){
			//	tinyMCE.activeEditor.setContent( mfpsp_do_spot(tinyMCE.activeEditor.getContent()) );
			//}
			console.log(e);
			if(e.command=="mceInsertRawHTML"){

				//tinyMCE.activeEditor.insertContent(e.value,{format: 'raw'});
				//tinyMCE.activeEditor.setContent( mfpsp_do_spot(tinyMCE.activeEditor.getContent()) );
				tinyMCE.activeEditor.insertContent( e.value );
			}
		});
		editor.on('mouseup',function(event){
			var dom = editor.dom,
				node = event.target;
			if(node.nodeName === 'IMG' && node.className.split(" ").indexOf("wp_mfpsp_video") >= 0){
				event.preventDefault();
				tb_show('', ajaxurl + '?action=tmce_button_mfp-access-player&datas-mfpsp='+encodeURIComponent(jQuery(node).data('content' ) ));
				if(called == false) {
					called = true;
					jQuery('#mfpsp_button').live("click", function(e) {
						e.preventDefault();

						tinyMCE.activeEditor.execCommand('mceInsertRawHTML', 0, mfpsp_create_content());

						tb_remove();
					});
				}
			}
		});
		// Add Command when Button Clicked
		editor.addCommand('mfp_access_player', function(ui, v) {
			//alert('Button clicked!');
			tb_show('', ajaxurl + '?action=tmce_button_mfp-access-player');
			if(called == false) {
				called = true;
				jQuery('#mfpsp_button').live("click", function(e) {
					e.preventDefault();

					tinyMCE.activeEditor.execCommand('mceInsertRawHTML', 0, mfpsp_create_content());

					tb_remove();
				});
			}
		});
	});
})();
function mfpsp_do_spot(co){
	return co.replace(/(<p>)?<video.*data-mfp.*<\/video>(<\/p>)?( )*((<p>)?\n?(<p>)?<div.*class="mfp-live".*\/div>(<\/p>)?)?/g,function(a){
		a=a.replace(/<p>/g,'').replace(/<\/p>/g,'').replace(/\n/g,'');
		var img = jQuery("<img src='/wp-content/plugins/mfp-access-player/poster_temp.png' class='wp_mfpsp_video mceItem' title='mfp-access-player video' />");
		img.attr('data-content',a);
		return img.wrap('<p/>').parent().html();
		//return '<img src="/wp-content/plugins/mfp-access-player/icon.png" class="wp_mfpsp_video mceItem" data-content=\''+JSON.stringify(b)+'\' title="mfp-access-player video" />';
	});
}
function mfpsp_get_spot(co){
	return co.replace(/<img class=.*wp_mfpsp_video.* \/>/g,function(a){
		var temp = jQuery(a);
		return temp.data('content');
	});

}
function mfpsp_create_content() {
	var $ = jQuery;
	if($('mfpsp_video_url').val()!=''){
		var ret;
		var options={videos:{},transcripts:{}};
		if($('#mfpsp_video_lowdef_url').val()!=''){
			options.videos.lowdef=$('#mfpsp_video_lowdef_url').val();
		}
		if($('#mfpsp_video_audiodesc_url').val()!=''){
			options.videos.audiodesc=$('#mfpsp_video_audiodesc_url').val();
		}
		if($('#mfpsp_video_signed_url').val()!=''){
			options.videos.signed=$('#mfpsp_video_signed_url').val();
		}
		if($('#mfpsp_transcript_html').val()!=''){
			options.transcripts.html=$('#mfpsp_transcript_html').val();
		}
		if($('#mfpsp_transcript_txt').val()!=''){
			options.transcripts.txt=$('#mfpsp_transcript_txt').val();
		}
		if($('#mfpsp_live').is(':checked')){
			options.live='#'+$('#mfpsp_live').val();
		}
		ret = "<video style='width: 100%; height: auto;' data-mfp data-options='"+JSON.stringify(options)+"'";
		if($('#mfpsp_poster_url').val()!=''){
			ret+=' poster="'+$('#mfpsp_poster_url').val()+'"';
		}
		ret+='>';
		ret+='<source src="'+$('#mfpsp_video_url').val()+'" "type="video/mp4">';
		var tracks = $('.mfpsp_track_url');
		for(var i=0;i<tracks.length;i++){
			if(tracks[i].value!=''){
				ret+='<track src="'+$('.mfpsp_track_url')[i].value+'" kind="subtitles" label="'+$('.mfpsp_track_name')[i].value+'" srclang="'+$('.mfpsp_track_iso')[i].value+'" />';
			}
		}
		if($('#mfpsp_chapters').val()!=''){
			ret+='<track src="'+$('#mfpsp_chapters').val()+'" kind="chapters" label="Chapters" srclang="en" />';
		}
		ret+="</video>";
		if($('#mfpsp_live').is(':checked')){
			ret+='<div class="mfp-live" id="'+$('#mfpsp_live').val()+'"></div>';
		}

		return ret;
	}
	else{
		alert('You didn\'t select any video');
		return false;
		
	}
}

function mfpsp_uniqId() {
  return Math.round(new Date().getTime() + (Math.random() * 100));
}
function mfpsp_add_track(track=false){
	var $ = jQuery;
	var name = "";
	var iso = "en";
	var url = "";
	if(track!==false){
		name = track.attr('label');
		iso = track.attr('srclang');
		url = track.attr('src');
	}
	var track = $('<fieldset style="border: 1px solid #000">');
	var p = $('<p>');
	var remove = $('<input type="button" class="button-secondary" value="-">');
	remove.click(function(){
		$(this).parent().parent('fieldset').remove();
	});
	p.append(remove);
	p.append('<br /><span>Subtitle track :</span><br />');
	p.append('<input type="text" class="mfpsp_track_name" name="mfpsp_track_name[]" value="'+name+'" placeholder="Name of the track" /><br />');
	p.append('<input type="text" class="mfpsp_track_iso" name="mfpsp_track_iso[]" value="'+iso+'" placeholder="ISO" size="2" /><span class="description">ISO code 2 chars of the language</span><br />');
	var id = mfpsp_uniqId();
	p.append('<input type="text" class="mfpsp_track_url" name="mfpsp_track_url[]" value="'+url+'" placeholder="URL http://..." id="'+id+'" style="width: 80%;" />');
	var button = $('<input type="button" class="mfpsp_media_button button-primary" value="Select file" data-target="'+id+'" data-title="Select subtitle file" data-button="Use this subtitle">');
	button.on('click', function(event){
		event.preventDefault();
		mfpsp_file_frame(this, set_to_post_id, wp_media_post_id);
	});
	p.append(button);
	track.append(p);
	$('#mfpsp_tracks').append(track);
}
function mfpsp_file_frame(elmt,set_to_post_id, wp_media_post_id){
	var file_frame;
	var $ = jQuery;
	var button = $(elmt);
	if(button.data('file_frame') !== 'undifined'){
		file_frame = button.data('file_frame');
	}
	// If the media frame already exists, reopen it.
	if ( file_frame ) {
		// Set the post ID to what we want
		file_frame.uploader.uploader.param( 'post_id', set_to_post_id );
		// Open frame
		file_frame.open();
		return;
	} else {
		// Set the wp.media post id so the uploader grabs the ID we want when initialised
		wp.media.model.settings.post.id = set_to_post_id;
	}
	// Create the media frame.
	file_frame = wp.media.frames.file_frame = wp.media({
		title: button.data('title'),
		button: {
			text: button.data('button'),
		},
		multiple: false	// Set to true to allow multiple files to be selected
	});
	// When an image is selected, run a callback.
	file_frame.on( 'select', function() {
		// We set multiple to false so only get one image from the uploader
		attachment = file_frame.state().get('selection').first().toJSON();
		// Do something with attachment.id and/or attachment.url here
		$('#'+button.data('target')).val(attachment.url);
		if(button.data('img') !== 'undifined'){
			$( '#'+button.data('img') ).attr( 'src', attachment.url );
			$( '#'+button.data('img')+'_del' ).css('display','inline');
		}
		//$( '#image_attachment_id' ).val( attachment.id );
		// Restore the main post ID
		wp.media.model.settings.post.id = wp_media_post_id;
	});
	// Finally, open the modal
	
	file_frame.open();
	button.data('file_frame',file_frame);
}