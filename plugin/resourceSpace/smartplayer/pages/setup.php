<?php
include "../../../include/db.php";
include "../../../include/authenticate.php"; if (!checkperm("u")) {exit ("Permission denied.");}
include_once "../../../include/general.php";


if (getval("submit","")!="")
	{
	$videojs_cdn=getvalescaped("smartplayer_cdn","");
	
	$config=array();
	$config['smartplayer_cdn']=$videojs_cdn;

	set_plugin_config("smartplayer",$config);
	
	redirect("pages/team/team_home.php");
	}


include "../../../include/header.php";
?>
<div class="BasicsBox"> 
  <h2>&nbsp;</h2>
  <h1><?php echo $lang["smartplayer_configuration"];?></h1>
  

<form id="form1" name="form1" method="post" action="">

<?php echo config_boolean_field("smartplayer_cdn",$lang["smartplayer_cdn"],$smartplayer_cdn);?>

<div class="Question">  
<label for="submit"></label> 
<input type="submit" name="submit" value="<?php echo $lang["save"]?>">   
</div><div class="clearerleft"></div>

</form>
</div>	
<?php include "../../../include/footer.php";
