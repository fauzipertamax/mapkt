<?php
   session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "config.php";
	$sessuser=$_SESSION['unitid'];
	// $sesstipe=$_SESSION['tipe'];


	// echo $sessuser."<br>";	
 //    echo $sesstipe."<br>";


	
	if($sesstipe==2){
		$unit="and distribusi=".$_SESSION['dist']."";
		}else if($sesstipe==3){
		$unit="and area=".$_SESSION['area']."";
		}else if($sesstipe==4){
		$unit="and posko like '".$_SESSION['unitid']."%'";
		}else{
		$unit="and posko=".$_SESSION['unitid']."";
		}
	
	$sql="
SELECT 
a.distribusi distribusiid,a.area areaid,a.unit unitid,a.kode_asset, a.STATUS,a.tgl_lapor padam,b.alamat,b.coverage,
b.longitude, b.latitude,b.jenis_asset,b.no_tiang, 
(select unitname from unit d where d.unitid = a.DISTRIBUSI) AS DISTRIBUSI,
(select unitname from unit d where d.unitid = a.AREA) AS AREA,
(select unitname from unit d where d.unitid = b.UNIT) AS RAYON 
FROM integrasi_manuver a, ss_jaringan b
where a.status='PADAM'
and a.TYPE_ASSET=7
and b.status_nyala=0
and a.kode_asset=B.KODE_ASSET
".$unit."
";
									
				
            $sqlq=ociparse($conn,$sql);
			OCIEXECUTE($sqlq);
			
			// echo $sql;
			
			$json['success'] = true;
			$json['data'] = array();
            while ($row = oci_fetch_array($sqlq)) {
			 $data['dist'] = $row['DISTRIBUSI'];
			 $data['area'] = $row['AREA'];
			 $data['rayon'] = $row['RAYON'];
			 $data['lat'] = $row['LATITUDE'];
			 $data['lng'] = $row['LONGITUDE'];
			 $data['status'] = $row['STATUS'];
			 $data['waktu'] = $row['PADAM'];
			 $data['kode_asset'] = $row['KODE_ASSET'];
			 $data['jenis_asset'] = $row['JENIS_ASSET'];
			 $data['tiang'] = $row['NO_TIANG'];
			 $data['cover'] = $row['COVERAGE'];
			 array_push($json['data'], $data);
			}
            echo json_encode($json);
?>



