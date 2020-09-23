<?php
    session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include('../config.php');
	$sessuser=$_SESSION['userid'];
	$distribusi= $_GET['distribusi'];
	$area= $_GET['area'];
	$posko= $_GET['posko'];
	$type= $_GET['type'];
	$warna= $_GET['warna'];
	$koordinat= $_GET['koordinat'];
	
	$que="select * from trm_marker where unit=".$posko."";
	 $result = OCIParse($conn, $que);
	OCIexecute($result);
	
	$tmpcount = OCIFetch($result);
	

			if($tmpcount==1){
			$q="update trm_marker set warna='".$warna."',koordinat='".$koordinat."' where unit=".$posko."";
			}else{
	$q="insert into trm_marker(unit,area,distribusi,warna,koordinat,userid)values('".$posko."','".$area."','".$distribusi."','".$warna."','".$koordinat."',".$sessuser.")";
	}
	// echo $q;
	

	$exe=OCIPARSE($conn,$q);
	$execute=OCIEXECUTE($exe);
	
	
	if($execute){
	echo "true";
}else{
echo "false";
}
?>