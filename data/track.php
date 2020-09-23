<?php
   session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "config.php";
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
	
	$sql="
SELECT id_trans,
       date_time,
       CASE WHEN status = 'LOGIN' THEN 'Online' ELSE 'Offline' END AS status,
       no_hp,
       no_imei,
       latitude,
       longitude,
       user_id,
       user_name,
       unitname,
       rayon_posko,
       jml,
       CASE
          WHEN status = 'LOGOUT'
          THEN
             'grey'
          WHEN (SELECT x.status
                  FROM TRM_EMERGENCY x
                 WHERE user_id = x.userid AND emergency = 1) = 1
          THEN
             'EMERGENCY'
          ELSE
             icon
       END
          AS icon,
       emergency
  FROM MON_MOBILE_TRACK_ALL where 1=1 ".$unit."
							";
									
				
            $sqlq=ociparse($conn,$sql);
			OCIEXECUTE($sqlq);
			
			// echo $sql;
			
			$json['success'] = true;
			$json['data'] = array();
            while ($row = oci_fetch_array($sqlq)) {
			 $data['ID_TRANS'] = $row['ID_TRANS'];
			 $data['DATE_TIME'] = $row['DATE_TIME'];
			 $data['NO_HP'] = $row['NO_HP'];
			 $data['NO_IMEI'] = $row['NO_IMEI'];
			 $data['LATITUDE'] = $row['LATITUDE'];
			 $data['LONGITUDE'] = $row['LONGITUDE'];
			 $data['USERID'] = $row['USER_ID'];
			 $data['USERNAME'] = $row['USER_NAME'];
			 $data['UNITNAME'] = $row['UNITNAME'];
			 $data['ICON'] = $row['ICON'];
			 $data['STATUS'] = $row['STATUS'];
			 $data['JML'] = $row['JML'];
			 $data['TELPPELAPOR'] = $row['TELPPELAPOR'];
			 $data['ALAMAT'] = $row['ALAMAT'];
			 array_push($json['data'], $data);
			}
            echo json_encode($json);
?>