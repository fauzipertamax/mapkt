<?php
session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "../config.php";
	
	$lapor=$_GET['nolapor'];
	
	$sql=" SELECT a.status,to_char(a.tgleksekusi,'dd/mm/yyyy HH24:MI:SS')as tgleksekusi, (SELECT reguname
               FROM regu b
              WHERE a.reguid = b.reguid)
               AS namaregu
  FROM mon_mobile_new a where a.id_tiket='".$lapor."' order by a.tgleksekusi asc";
	
	  $sqlc=ociparse($conn,$sql);
			OCIEXECUTE($sqlc);

			$json['success'] = true;
			$json['data'] = array();
            while ($row = oci_fetch_array($sqlc)) {
			 $data['regu'] = $row['NAMAREGU'];
			 $data['status'] = $row['STATUS'];
			 $data['tgl'] = $row['TGLEKSEKUSI'];
			 array_push($json['data'], $data);
			}
            echo json_encode($json);

?>