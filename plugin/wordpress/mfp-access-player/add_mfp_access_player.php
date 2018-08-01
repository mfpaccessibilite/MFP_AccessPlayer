		<h2><?php _e("MFP Access Player", 'mfpsp');?></h2>
		<h3>Videos</h3>
		<p class="description">
		    <?php esc_html_e("Only the first video is required, you can leave the others empty","mfpsp");?>
		</p>
		<p>
			<?php _e("Video MP4: ", 'mfpsp');?><br />
			<input style="width: 80%;" id="mfpsp_video_url" type="text" name="mfpsp_video_url" placeholder="URL https://..." value="" />
			<input type="button" class="mfpsp_media_button button-primary" value="<?php _e("Select file", "mfpsp");?>" data-target="mfpsp_video_url" data-title="<?php _e("Select a video MP4","mfpsp");?>" data-button="<?php _e("Use this video","mfpsp");?>" >
		</p>
		<p>
		    <?php _e("Video Poster image : ","mfpsp");?><br />
		    <input type="button" class="mfpsp_media_button button-primary" value="<?php _e("Select Poster image", "mfpsp");?>" data-target="mfpsp_poster_url" data-title="<?php _e("Select a Video Poster Image","mfpsp");?>" data-button="<?php _e("Use this Image","mfpsp");?>" data-img="mfpsp_poster_img" ><br />
		    <a href="#none" id="mfpsp_poster_img_del" style="display: none;" onclick="jQuery('#mfpsp_poster_url').val('');jQuery('#mfpsp_poster_img').attr('src',jQuery('#mfpsp_poster_img').data('no-poster'));jQuery(this).css('display','none');"><?php _e("Unselect image","mfpsp");?></a><br />
		    <img id="mfpsp_poster_img" style="width: 200px;" src="<?php echo plugins_url().'/mfp-access-player/poster_temp.png';?>" data-no-poster="<?php echo plugins_url().'/mfp-access-player/poster_temp.png';?>" />
		    <input type="hidden" name="mfpsp_poster_url" id="mfpsp_poster_url" value="" />
		</p>
		<p>
			<?php _e("LowDef Video MP4: ", 'mfpsp');?><br />
			<input style="width: 80%;" id="mfpsp_video_lowdef_url" type="text" name="mfpsp_video_lowdef_url" placeholder="URL https://..." value="" />
			<input type="button" class="mfpsp_media_button button-primary" value="<?php _e("Select file", "mfpsp");?>" data-target="mfpsp_video_lowdef_url" data-title="<?php _e("Select a LowDef video MP4","mfpsp");?>" data-button="<?php _e("Use this video","mfpsp");?>" >
		</p>
		<p>
			<?php _e("AudioDesc Video MP4: ", 'mfpsp');?><br />
			<input style="width: 80%;" id="mfpsp_video_audiodesc_url" type="text" name="mfpsp_video_audiodesc_url" placeholder="URL https://..." value="" />
			<input type="button" class="mfpsp_media_button button-primary" value="<?php _e("Select file", "mfpsp");?>" data-target="mfpsp_video_audiodesc_url" data-title="<?php _e("Select a AudiDesc video MP4","mfpsp");?>" data-button="<?php _e("Use this video","mfpsp");?>" >
		</p>
		<p>
			<?php _e("Signed Video MP4: ", 'mfpsp');?><br />
			<input style="width: 80%;" id="mfpsp_video_signed_url" type="text" name="mfpsp_video_signed_url" placeholder="URL https://..." value="" />
			<input type="button" class="mfpsp_media_button button-primary" value="<?php _e("Select file", "mfpsp");?>" data-target="mfpsp_video_signed_url" data-title="<?php _e("Select a Signed video MP4","mfpsp");?>" data-button="<?php _e("Use this video","mfpsp");?>" >
		</p>
		<h3>Chapters</h3>
		<p class="description">
			<?php esc_html_e("Leave empty if you don't have chapter vtt file","mfpsp");?>
		</p>
		<p>
		<?php _e("Chapters WEBVTT: ", 'mfpsp');?><br />
			<input style="width: 80%;" id="mfpsp_chapters" type="text" name="mfpsp_chapters" placeholder="URL https://..." value="" />
			<input type="button" class="mfpsp_media_button button-primary" value="<?php _e("Select file", "mfpsp");?>" data-target="mfpsp_chapters" data-title="<?php _e("Select a WEBVTT Chapters file","mfpsp");?>" data-button="<?php _e("Use this WEBVTT as Chapters","mfpsp");?>" >
		</p>
		<h3>Transcripts</h3>
		<p class="description">
		    <?php esc_html_e("Leave empty if you don't have transcript","mfpsp");?>
		</p>
		<p>
			<?php _e("Transcipt HTML: ", 'mfpsp');?><br />
			<input style="width: 80%;" id="mfpsp_transcript_html" type="text" name="mfpsp_transcript_html" placeholder="URL https://..." value="" />
			<input type="button" class="mfpsp_media_button button-primary" value="<?php _e("Select file", "mfpsp");?>" data-target="mfpsp_transcript_html" data-title="<?php _e("Select a HTML transcript","mfpsp");?>" data-button="<?php _e("Use this transcript","mfpsp");?>" >
		</p>
		<p>
			<?php _e("Transcipt TXT: ", 'mfpsp');?><br />
			<input style="width: 80%;" id="mfpsp_transcript_txt" type="text" name="mfpsp_transcript_txt" placeholder="URL https://..." value="" />
			<input type="button" class="mfpsp_media_button button-primary" value="<?php _e("Select file", "mfpsp");?>" data-target="mfpsp_transcript_txt" data-title="<?php _e("Select a TXT transcript","mfpsp");?>" data-button="<?php _e("Use this transcript","mfpsp");?>" >
		</p>
		<h3>Subtitles</h3>
		<p class="description">
		    Subtitles are accepted in the following format : vtt, srt and stl
		</p>
		<div id="mfpsp_tracks">
		
		</div>
		<input type="button" id="mfpsp_add_track" class="button-primary" value="+"><br />
		<br />
		<h3>Activate live subtitle</h3>
		<input type="checkbox" id="mfpsp_live" value="<?php echo uniqid('mfpsp_'); ?>" /><label for="mfpsp_live">Activate</label><br />
		<br />

		<input name="mfpsp_button" id="mfpsp_button" type="submit" class="button-primary" value="<?php _e("Add the video", 'mfpsp');?>">
		
		<script type='text/javascript'>
		    var wp_media_post_id = wp.media.model.settings.post.id; // Store the old id
            <?php
            $my_saved_attachment_post_id = get_option( 'media_selector_attachment_id', 0 );
            ?>
            var set_to_post_id = <?php echo $my_saved_attachment_post_id; ?>; // Set this
            jQuery( document ).ready( function( $ ) {
            	<?php
            	if($_GET['datas-mfpsp']!=''){
            		?>
                	var datas = "<?php echo $_GET['datas-mfpsp']; ?>";
                	var temp = jQuery('<p/>');
                	temp.html(datas);
                	var vid = temp.find('video');
                	var opt = vid.data('options');
                	var source = vid.find('source');
                    var subtitles = vid.find('track[kind="subtitles"]');
                    var chapter = vid.find('track[kind="chapters"]')
                	jQuery('#mfpsp_video_url').val(source.attr('src'));
                	if(opt.videos.lowdef){
                        jQuery('#mfpsp_video_lowdef_url').val(opt.videos.lowdef);
                    }
                    if(opt.videos.audiodesc){
                        jQuery('#mfpsp_video_audiodesc_url').val(opt.videos.audiodesc);
                    }
                    if(opt.videos.signed){
                        jQuery('#mfpsp_video_signed_url').val(opt.videos.signed);
                    }
                    if(opt.transcripts.html){
                        jQuery('#mfpsp_transcript_html').val(opt.transcripts.html);
                    }
                    if(opt.transcripts.txt){
                        jQuery('#mfpsp_transcript_txt').val(opt.transcripts.txt);
                    }
                    if(opt.live){
                        jQuery('#mfpsp_live').val(opt.live.substring(1));
                        jQuery('#mfpsp_live')[0].checked=true;
                    }
                    if(vid.attr('poster')){
                        jQuery('#mfpsp_poster_url').val(vid.attr('poster'));
                        jQuery('#mfpsp_poster_img').attr('src',vid.attr('poster'));
                    }
                    if(chapter.length>0){
                        jQuery('#mfpsp_chapters').val(chapter.attr('src'));
                    }
                    for(var i=0 ; i<subtitles.length ; i++){
                        var s = $(subtitles[i]);
                        mfpsp_add_track(s);
                    }
                    jQuery('#mfpsp_button').val("Update this video");
            		<?php
                }
            	?>

                // Uploading files
                
                
                jQuery('.mfpsp_media_button').on('click', function( event ){
                    event.preventDefault();
                    mfpsp_file_frame(this, set_to_post_id, wp_media_post_id);
                });
                // Restore the main ID when the add media button is pressed
                jQuery( 'a.add_media' ).on( 'click', function() {
                    wp.media.model.settings.post.id = wp_media_post_id;
                });
                $('#mfpsp_add_track').on('click',function(event){
                    event.preventDefault();
                    mfpsp_add_track();
                });
            });
            jQuery('#TB_ajaxContent').css('width','calc(100% - 30px)').css('height','calc(100% - 60px)');
	    </script>