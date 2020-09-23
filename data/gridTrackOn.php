<?php
	session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "config.php";
	$sessuser=$_SESSION['unitid'];
	$sesstipe=$_SESSION['tipe'];
	
	if($sesstipe==2){
		$unit="and distribusi=".$_SESSION['dist']."";
		}else if($sesstipe==3){
		$unit="and area=".$_SESSION['area']."";
		}else if($sesstipe==4){
		$unit="and rayon_posko like '".$_SESSION['rayon']."%'";
		}else{
		$unit="and rayon_posko=".$_SESSION['unitid']."";
		}
	
	$sql=" SELECT USER_NAME, NO_IMEI FROM MON_MOBILE_TRACK5 where 1=1 AND STATUS = 'LOGIN'  ".$unit."";
	$sqlq=ociparse($conn,$sql);
	OCIEXECUTE($sqlq);
			
			
	$json['success'] = true;
	$json['data'] = array();
    while ($row = oci_fetch_array($sqlq)) {
			 $data['USERNAME'] = $row['USER_NAME'];
			 $data['IMEI'] = $row['NO_IMEI'];
			 array_push($json['data'], $data);
			}
            echo json_encode($json);
?>