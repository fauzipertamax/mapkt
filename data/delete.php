<?php
    session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include('../config.php');
	$posko= $_POST['posko'];

	
	
	$q="delete trm_marker where unit=".$posko."";
	
	// echo $q;
	$exe=OCIPARSE($conn,$q);
	$execute=OCIEXECUTE($exe);
	
	if($execute){
	echo "true";
}else{
echo "false";
}
?>