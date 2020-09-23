<?php
   session_start();
	error_reporting(E_ALL ^ E_NOTICE);

include('config.php');
$sessuser=$_SESSION['userid'];
$regukoord=$_POST['regu'];
$tgl=$_POST['tgl'];
 

 
$stid = oci_parse($conn,'SELECT id_trans,id_tiket,date_time,to_char(date_time,''''HH24:mi:ss'''') as tgl,latitude,longitude,user_id,unit_id,user_name
    FROM (SELECT null as id_trans,id_tiket,
                 date_time,
                 latitude,
                 longitude,
                 user_id,
                 unit_id,
                 (SELECT username
                    FROM appuser a
                   WHERE trm_updatestatus_check.user_id = a.userid)
                    AS user_name
            FROM trm_updatestatus_check
           WHERE stat_baru != ''''Nyala''''
          UNION
          SELECT id_trans,NULL,
                 date_time,
                 Latitude,
                 longitude,
                 user_id,
                 unit_id,
                 user_name
            FROM trm_active_check) where user_id in (select userid from regumember where reguid=".$regukoord.")  and to_char(date_time,''''dd/mm/yyyy'''')='".$tgl."'
ORDER BY date_time ASC');
// $result=OCIPARSE($conn,$query);

OCIEXECUTE($stid);

// var_dump($result);

 if(!$stid){
    $res = array('success' => false);
	echo json_encode($res);
    exit();
}else{



            $json['success'] = true;
			$json['regu'] = array();
            while ($row = oci_fetch_array($stid)) {
			 $data['ID_TIKET'] = $row['ID_TIKET'];
			 $data['DATE_TIME'] = $row['TGL'];
			 $data['LATITUDE'] = $row['LATITUDE'];
			 $data['LONGITUDE'] = $row['LONGITUDE'];
			 $data['USER_ID'] = $row['USER_ID'];
			 $data['UNIT_ID'] = $row['UNIT_ID'];
			 $data['USER_NAME'] = $row['USER_NAME'];
			 $data['ID_TRANS'] = $row['ID_TRANS'];
			 array_push($json['regu'], $data);
			}
            echo json_encode($json);

}
oci_close($conn);

oci_free_statement($stid);  

sleep(3);
?>