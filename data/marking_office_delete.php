<?php
    session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "config.php";
	$UnitId = $_SESSION['unitid'];
	$UnitTypeId= $_SESSION['tipe'];
	
	$q = "delete trm_marking_office where UNITID=".$UnitId."";
	$exe=OCIPARSE($conn,$q);
	$execute=OCIEXECUTE($exe);
	
	if($execute){
		echo "true";
	}else{
		echo "false";
	}
?>