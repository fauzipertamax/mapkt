<?php
    session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include('../config.php');
$ID=$_SESSION['dist'];
$unitx=$_SESSION['unitid'];
$sesstipe=$_SESSION['tipe'];

if($sesstipe==2){
		$unit="and distribusi=".$_SESSION['dist']."";
		}else if($sesstipe==3){
		$unit="and area=".$_SESSION['area']."";
		}else if($sesstipe==4){
		$unit="and unit like '".$_SESSION['rayon']."%'";
		}else{
		$unit="and unit=".$_SESSION['unitid']."";
		}



if(isset($unitx)){
 $a="case when unit !=".$unitx." then '#0000000' else 
       TRIM (a.warna) end AS warnapoly,";
}else{$a="TRIM (a.warna) AS warnapoly,";}

// if(isset($ID)){$c="where a.distribusi=".$ID."";}else{$c="";}

$q="select  (SELECT  INITCAP (unitname)
          FROM plnadmin.unit b
         WHERE a.distribusi = b.unitid)
          AS distribusi,
       (SELECT INITCAP (unitname)
          FROM plnadmin.unit b
         WHERE a.area = b.unitid)
          AS area,
       (SELECT INITCAP (unitname)
          FROM plnadmin.unit b
         WHERE a.unit = b.unitid)
          AS unit,
       a.unit AS unitid,
       ".$a."
       a.koordinat
  FROM plnadmin.trm_marker a where 1=1 ".$unit."";


  
    // echo $q;

$exe=OCIPARSE($conn,$q);
OCIEXECUTE($exe);

			$json['success'] = true;
			$json['shapes'] = array();
            while ($row = oci_fetch_array($exe)) {
			 $data['unit'] = $row['UNIT'];
			 $data['unitid'] = $row['UNITID'];
			 $data['area'] = $row['AREA'];
			 $data['warna'] = $row['WARNAPOLY'];
			 $data['ckoor'] = preg_match_all("/\((?:[^()]|(?R))+\)|'[^']*'|[^(),\s]+/", $row['KOORDINAT'], $matches);
			 $data['koord'] = $matches;
			 array_push($json['shapes'], $data);
			}
            echo json_encode($json);
			

// preg_match_all("/\((?:[^()]|(?R))+\)|'[^']*'|[^(),\s]+/", $row['KOORDINAT'], $matches);

// print_r($matches);


?>