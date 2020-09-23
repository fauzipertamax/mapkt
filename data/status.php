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
	
	if($_GET['status']=='1'){
	$status="and laststatus in ('Nyala','Nyala Sementara')";
	} else{
	$status="and laststatus not in ('Nyala','Nyala Sementara')";
	}
	
	$sql="SELECT *
  FROM mon_mobile_new2
 WHERE id_trans IN (  SELECT MAX (id_trans)
                        FROM mon_mobile_new2
                    GROUP BY id_tiket)  and trunc(tanggallapor) between sysdate-3 and sysdate ".$unit." ".$status."";
									
				
            $sqlq=ociparse($conn,$sql);
			OCIEXECUTE($sqlq);
			
			$json['success'] = true;
			$json['data'] = array();
            while ($row = oci_fetch_array($sqlq)) {
			 $data['ID_TRANS'] = $row['ID_TRANS'];
   $data['ID_TIKET'] = $row['ID_TIKET'];
   $data['LATITUDE'] = $row['LATITUDE'];
   $data['LONGITUDE'] = $row['LONGITUDE'];
   $data['LASTSTATUS'] = $row['LASTSTATUS'];
   $data['ALAMAT'] = $row['ALAMATPELAPOR'];
   $data['PELAPOR'] = $row['NAMAPELAPOR'];
   $data['IDPEL'] = $row['IDPEL'];
   $data['TELPPELAPOR'] = $row['TELPPELAPOR'];
   $data['CAUSE'] = $row['CAUSE'];
   $data['ACTION'] = $row['ACTION'];
			 array_push($json['data'], $data);
			}
            echo json_encode($json);
?>