<?php
    session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "config.php";
	$UnitId = $_SESSION['unitid'];
	$UnitTypeId= $_SESSION['tipe'];
	$NamaKantor = $_POST['NamaKantor'];
	$Keterangan= $_POST['Keterangan'];
	$Koordinat= $_POST['Koordinat'];
	$Zoom= $_POST['Zoom'];
	$sessuser=$_SESSION['userid'];
	
	//$Koordinats = preg_replace("/[^0-9,-,.]/", "", $Koordinat);
	$a = str_replace('(', '', $Koordinat);
	$b = str_replace(')', '', $a);
	$Koordinats = str_replace(' ', '', $b);
	
	
	$queCheck = "select * from trm_marking_office where UNITID = ".$UnitId."";
	$result = OCIParse($conn, $queCheck);
	OCIexecute($result);
	$tmpcount = OCIFetch($result);
	
	if($tmpcount==1){
		$query = "update trm_marking_office set 
		NamaKantor = '".$NamaKantor."',	
		Keterangan = '".$Keterangan."'		
		where UNITID = ".$UnitId."";
	}else{
		$query = "insert into trm_marking_office(UNITID,UNITTYPEID,NAMAKANTOR,KETERANGAN,KOORDINAT,ZOOM,USERID) values 
		('".$UnitId."','".$UnitTypeId."','".$NamaKantor."','".$Keterangan."','".$Koordinats."','".$Zoom."',".$sessuser.")";
	}
	
	$exe=OCIPARSE($conn,$query);
	$execute=OCIEXECUTE($exe);
	
	if($execute){
		echo "true";
	}else{
		echo "false";
	}
?>