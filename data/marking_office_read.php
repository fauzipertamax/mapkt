<?php
    session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "config.php";
	$UnitId = $_SESSION['unitid'];
	$UnitTypeId= $_SESSION['tipe'];
	
	$sql = "select * from trm_marking_office where UNITID = '$UnitId'";
	$exe=OCIPARSE($conn,$sql);
	OCIEXECUTE($exe);
	
	$json['success'] = true;
	
	if ($row = oci_fetch_assoc($exe)){
		$json['UnitId'] = $row['UNITID'];
		$json['UnitTypeId'] = $row['UNITTYPEID'];
		$json['NamaKantor'] = $row['NAMAKANTOR'];
		$json['Keterangan'] = $row['KETERANGAN'];
		$json['Koordinat'] = $row['KOORDINAT'];
		$json['Zoom'] = $row['ZOOM'];
	} 
	
	echo json_encode($json);
?>