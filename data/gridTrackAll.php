<?php
	session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include('../config.php');

	$sessuser=$_SESSION['unitid'];
	$sesstipe=$_SESSION['tipe'];


	// echo $sessuser."<br>";	
 //    echo $sesstipe."<br>";
	
	if($sesstipe==2){
		$unit="and distribusi=".$_SESSION['dist']."";
		}else if($sesstipe==3){
		$unit="and area=".$_SESSION['area']."";
		}else if($sesstipe==4){
		$unit="and rayon_posko like '".$_SESSION['unitid']."%'";
		}else{
		$unit="and rayon_posko=".$_SESSION['unitid']."";
		}
	
	$sql=" SELECT USER_NAME,UNITNAME,AREANAME, CASE WHEN STATUS = 'LOGIN' THEN 'Online' ELSE 'Offline' END AS STATUS, LATITUDE, LONGITUDE  FROM MON_MOBILE_TRACK_ALL where 1=1 ".$unit."";
	$sqlq=ociparse($conn,$sql);
	OCIEXECUTE($sqlq);
			
			
	$json['success'] = true;
	$json['data'] = array();
    while ($row = oci_fetch_array($sqlq)) {
			 $data['USERNAME'] = $row['USER_NAME'];
			 $data['STATUS'] = $row['STATUS'];
			 $data['UNITNAME'] = $row['UNITNAME'];
			 $data['AREANAME'] = $row['AREANAME'];
			 $data['LATITUDE'] = $row['LATITUDE'];
			 $data['LONGITUDE'] = $row['LONGITUDE'];
			 array_push($json['data'], $data);
			}
            echo json_encode($json);


?>