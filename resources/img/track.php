<?php
   session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "config.php";
	$sessuser=$_SESSION['unitid'];
	$type=$_SESSION['tipe'];
	
	$ds=$_POST['dist'];
	$cb=$_POST['cab'];
	$pos=$_POST['posko'];
	$reg=$_POST['usertrack'];

if(isset($ds) and !empty($ds)){
if(isset($cb) and !empty($cb)){
if(isset($pos) and !empty($pos)){
$cari = "AND UNIT_ID = ".$pos."";
} else {$cari= "AND UNIT_ID in (select unitid from unit where unitparent=".$cb." and unittypeid=5 and isactive=1)";}
} else {$cari = "AND UNIT_ID in (select unitid from unit where unitparent in (select unitid from unit where unitparent=".$ds." and unittypeid=3 and isactive=1) AND unittypeid=5 and isactive=1)";}
} else {$cari="";}

if(isset($reg) and !empty($reg)){$user="AND UPPER(USER_NAME)=upper('".$reg."')";}else{$user="";}


if($type==2){
	$unituser="AND UNIT_ID in (select unitid from unit where unitparent in (select unitid from unit where unitparent=".$sessuser." and unittypeid=3 and isactive=1) AND unittypeid=5 and isactive=1)";
	}else if($type==3){$unituser="AND UNIT_ID in (select unitid from unit where unitparent=".$sessuser." and unittypeid=5 and isactive=1)";
	}else if($type==5){$unituser="AND UNIT_ID = ".$sessuser."";
	}else if($type==4){$unituser="and UNIT_ID=(select unitcode from unit where unitid='".$sessuser."' and unittypeid=5)";
	}
	
	if(empty($cari) AND empty($user)){
	$cari=$unituser;
	}

	
	$sql="SELECT a.ID_TRANS,
         TO_CHAR (a.DATE_TIME, 'dd/mm/yyyy HH24:MI:SS') AS DATE_TIME,
       CASE
          WHEN (sysdate-a.DATE_TIME >= (30/1440)) THEN 'grey'
           else  'greenm'
       END as ICON,
       CASE
          WHEN (sysdate-a.DATE_TIME >= (30/1440)) THEN 'Offline'
          else  'Online'
       END as status,
       a.NO_HP,
       a.NO_IMEI,
       a.LATITUDE,
       a.LONGITUDE,
       a.USER_ID,
       a.UNIT_ID,
       INITCAP (a.USER_NAME) AS user_name,
       INITCAP (b.UNITNAME) AS unitname
  FROM TRM_ACTIVE_CHECK a, UNIT b
 WHERE     a.ID_TRANS IN (  SELECT MAX (ID_TRANS) AS idtrans
                              FROM TRM_ACTIVE_CHECK
                             WHERE USER_ID IS NOT NULL ".$cari." ".$user."
                          GROUP BY USER_ID)
       AND a.unit_id = b.unitid";
					
// echo $sql;				
				
     $sqlq=ociparse($conn,$sql);
			OCIEXECUTE($sqlq);
			
			
	$count="select count(*)total from (".$sql.")";
	$sqlc=ociparse($conn,$count);
			OCIEXECUTE($sqlc);
			while ($rowc = oci_fetch_array($sqlc)) {
			$totaldata=$rowc['TOTAL'];
			}
			$json['success'] = true;
			$json['jumlah'] = $totaldata; 
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
			 array_push($json['data'], $data);
			}
            echo json_encode($json);
?>