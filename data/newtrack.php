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
	
	$sql="
SELECT *
  FROM MON_MOBILE_TRACK_FULL2 where 1=1 ".$unit."
							";
									
				
            $sqlq=ociparse($conn,$sql);
			OCIEXECUTE($sqlq);
			
			// echo $sql;
			
			$json['success'] = true;
			$json['data'] = array();
            while ($row = oci_fetch_array($sqlq)) {
			 $data['ID_TRANS'] = $row['ID_TRANS'];
			 $data['LATITUDE'] = $row['LATITUDE'];
			 $data['LONGITUDE'] = $row['LONGITUDE'];
			 $data['USERID'] = $row['USER_ID'];
			 $data['UNITNAME'] = $row['UNITNAME'];
			 $data['ICON'] = $row['ICON'];
			 $data['TIPE'] = $row['TIPE'];
			 $data['STATUS'] = $row['STATUS'];
			 $data['JML'] = $row['JML'];
			 $data['USER_NAME'] = $row['USER_NAME'];
			 $data['ID_TIKET'] = $row['ID_TIKET'];
			 $data['IDPEL'] = $row['IDPEL'];
			 $data['NAMAPELAPOR'] = $row['NAMAPELAPOR'];
			 $data['ACTION'] = $row['ACTION'];
			 $data['CAUSE'] = $row['CAUSE'];
			 $data['LASTSTATUS'] = $row['LASTSTATUS'];
			 $data['ALAMAT'] = $row['ALAMATPELAPOR'];
			 $data['TELPPELAPOR'] = $row['TELPPELAPOR'];
			 $data['DATE_TIME'] = $row['DATE_TIME'];
			 array_push($json['data'], $data);
			}
            echo json_encode($json);
?>