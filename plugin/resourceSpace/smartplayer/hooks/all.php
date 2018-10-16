<?php
function HookSmartplayerAllAdditionalheaderjs(){
    global $baseurl,$smartplayer_cdn;
	 ?>
	<script>
	    var oldJQuery = jQuery.noConflict();
	</script>
	<script   src="https://code.jquery.com/jquery-3.1.1.js"   integrity="sha256-16cdPddA6VdVInumRGo6IbivbERE8p7CQR3HzTBuELA="   crossorigin="anonymous"></script>
	<script   src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js"   integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E="   crossorigin="anonymous"></script>
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css" type="text/css">
    <?php
    if($smartplayer_cdn) {
    ?>
    <script src="https://cdn.jsdelivr.net/gh/mfpaccessibilite/MFP_AccessPlayer@1119e9b36ed0e84fcd10475a51af315747c74d2a/MFP/mfp.js"></script>
    <?php
    } else{
    ?>
	<script src="<?php echo $baseurl?>/plugins/smartplayer/lib/MFP/mfp.js"></script>
    <?php
    }
    ?>
	<script>
	    var newJQuery = jQuery.noConflict();
	    jQuery=oldJQuery;
	    $=oldJQuery;
	</script>
<?php 
}

function HookSmartplayerViewReplacerenderinnerresourcepreview(){
	global $resource ,$ref,$baseurl,$flashpath, $width,$height,$thumb,$pagename,$userfixedtheme,$ffmpeg_preview_max_width,$ffmpeg_preview_max_height,$mime_type_by_extension,$ffmpeg_preview_extension,$ffmpeg_preview_force;
	if ($pagename=="search"){global $result,$n;$resource=$result[$n];} else {global $resource;}
	$rdata=get_resource_field_data($resource['ref']);
	$filename='';
	foreach($rdata as $data){
	    if($data['name']=='originalfilename'){
	        $filename=$data['value'];
	    }
	}
    $filename=pathinfo($filename);
    $filename=$filename['filename'].'_';
	$flashpath=str_replace(urlencode($baseurl),"",$flashpath);
    
	$flashpath=urldecode($baseurl.$flashpath);
	$width=$ffmpeg_preview_max_width;
	$height=$ffmpeg_preview_max_height;
	if ($pagename=="search"){$width="355";$height=355/$ffmpeg_preview_max_width*$ffmpeg_preview_max_height;}
	$rand=rand();
	$flashpath=get_resource_path($ref,false,'',false,$resource['file_extension']);
    $url_parts = parse_url($flashpath);
    $flashpath=$url_parts['path'];
    $alts=get_alternative_files($ref);
   
    $videos=array();
    $transcripts=array();
    $chapters=false;
    $tracks=array();
    foreach($alts as $alt){
        $path = get_resource_path($ref,false,'',false,$alt['file_extension'],-1,1,'',"",$alt['ref']);
        $path = parse_url($path);
        $path = $path['path'];
        $alt['path']=$path;
        $alt['name']=str_replace($filename,'',$alt['name']);
        if($alt['file_extension']=='m4v' || $alt['file_extension']=='mp4'){
            $name=explode('.',$alt['name']);
            $name=$name[0];
            $alt['path']=$path;
            if($name=='lowdef'){
                $videos['lowdef']=$alt;
            }
            elseif($name=='audiodesc'){
                $videos['audiodesc']=$alt;
            }
            elseif($name=='signed'){
                $videos['signed']=$alt;
            }
        }
        else if($alt['file_extension']=='vtt'){
            $name=explode('.',$alt['name']);
            $name=$name[0];
            $name=explode('_',$name);
            $alt['lang']=$name[0];
            if(count($name)>1){
                $alt['name']=$name[1];
            }
            else{
                $name[1]='';
            }
            if($name[1]=='chapters'){
                $chapters=$alt;
            }
            else if(strlen($name[0])==2){
                $tracks[]=$alt;
            }
        }
        else if($alt['file_extension']=='srt' || $alt['file_extension']=='stl'){
            $name=explode('.',$alt['name']);
            $name=$name[0];
            $name=explode('_',$name);
            $alt['lang']=$name[0];
            if(count($name)>1){
                $alt['name']=$name[1];
            }
            else{
                $name[1]='';
            }
            if(strlen($name[0])==2){
                $tracks[]=$alt;
            }
        }
        else if($alt['name']=='transcript.txt'){
            $transcripts['txt']=$alt;
        }
        else if($alt['name']=='transcript.html' || $alt['name']=='transcript.htm'){
            $transcripts['html']=$alt;
        }
        //echo $alt['name'].' =&gt; '.$alt['ref'].' =&gt; '.$alt['path'].'<br />';
        //print_r($chapters);
    }
    
    
    
	?>
	
	
	<style>
	    #videoContainer{
	        max-width: calc(100% - 460px);
	        width: 1024px;
	        min-width: 450px;
	    }
	    @media(max-width:1100px) {
	        #videoContainer{
	            width: 100%;
	            max-width: 100%;
	        }
	    }
	</style>
<div class="Picture" id="videoContainer">
    <video id="vid<?php echo $rand?>">
        <source src="<?php echo $flashpath;?>" type="video/mp4" />
        <?php
        if($chapters!==false){
        ?>
        <track src="<?=$chapters['path']?>" kind="chapters" label="Chapitres" srclang="<?=$chapters['lang']?>" />
        <?php
        }
        foreach($tracks as $track){
        ?>
        <track src="<?=$track['path']?>" kind="subtitles" label="<?=$track['name']?>" srclang="<?=$track['lang']?>" />
        <?php
        }
        ?>
    </video>
    
</div>
<script>
jQuery = newJQuery;
$=jQuery;
var player = '#vid<?=$rand?>';
var options = {lang:'fr',<?php
        if(count($videos)>0){
        ?>
        videos:{
        <?php
            foreach($videos as $name=>$video){
            ?>
            <?=$name?>:'<?=$video['path']?>',
            <?php
            }
        ?>
        },
        <?php
        }
        if(count($transcripts)>0){
        ?>
        transcripts:{
        <?php
            foreach($transcripts as $name=>$video){
            ?>
            <?=$name?>:'<?=$video['path']?>',
            <?php
            }
        ?>
        },
        <?php
        }
        ?>};
        var vid = new MFP(player,options);
        vid.init();
        jQuery=oldJQuery;
        $=jQuery;
</script>
	<?php
	return true;
}
/*	Embed codes are going to be a problem for HTML5 players.
 *  You can only offer a video tag and sources, but these player libs rely on
 *  JS to restyle or fall back to flash.
 * 
function HookVideojsViewReplaceembedcode(){
	global $baseurl,$ffmpeg_preview_max_height,$ffmpeg_preview_max_width, $flashpath, $thumb,$colour,$height,$width,$alt_file_path,$resource;
	echo htmlspecialchars('<video style="background-color:black;" controls poster="'.urldecode($thumb).'" style="width:'.$width.'px;height:'.$height.'px;" >');
	echo htmlspecialchars('<source src="'.$flashpath.'" ></video>');
return true;
}
*/
