<?php
include "config.php";
$picid=$_GET['id'];
$picst=$_GET['img'];

if($picst==1){$kl="image_01";}else
if($picst==2){$kl="image_02";}else
if($picst==3){$kl="image_03";}

$sql="select image_01,image_02,image_03 from M_APKT.TRM_INSERTPICTURE_CHECK where id_tiket ='".$picid."'";

	
	  $sqlq=ociparse($conn,$sql);
			OCIEXECUTE($sqlq);

$row = oci_fetch_array($sqlq, OCI_ASSOC+OCI_RETURN_NULLS);
if (!$row) {
    echo "<img border=2 padding=1 width=215 height=267 src=no_photo.jpg />";
} else {
	if($picst==1){
    $img = $row['IMAGE_01']->load();
	}else if($picst==2){
	$img = $row['IMAGE_02']->load();
	}else if($picst==3){
	$img = $row['IMAGE_03']->load();
	}
    header("Content-type: image/jpeg");
    print $img;
}
?>
