<?php
   session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "config.php";
	$sessuser=$_SESSION['unitid'];
	
	$sql="SELECT NO_EMERGENCY,
       NO_IMEI,
       USERID,
       UNITID,
       MESSAGE,
       TO_CHAR (SEND_DATE, 'dd/mm/yyyy HH24:Mi:ss') AS SEND_DATE,
       CLOSE_DATE,
       STATUS,
       (SELECT reguname
          FROM regu
         WHERE trm_emergency.REGUID = regu.reguid)
          AS reguid
  FROM TRM_EMERGENCY WHERE UNITID=".$sessuser." and status=1 ";
									
				
            $sqlq=ociparse($conn,$sql);
			OCIEXECUTE($sqlq);
			
			$json['success'] = true;
			$json['data'] = array();
            while ($row = oci_fetch_array($sqlq)) {
			 $data['NO_EMERGENCY'] = $row['NO_EMERGENCY'];
			 $data['NO_IMEI'] = $row['NO_IMEI'];
			 $data['USERID'] = $row['USERID'];
			 $data['UNITID'] = $row['UNITID'];
			 $data['MESSAGE'] = $row['MESSAGE'];
			 $data['SEND_DATA'] = $row['SEND_DATE'];
			 $data['CLOSE_DATE'] = $row['CLOSE_DATE'];
			 $data['STATUS'] = $row['STATUS'];
			 $data['REGUID'] = $row['REGUID'];
			 array_push($json['data'], $data);
			}
            echo json_encode($json);
?>