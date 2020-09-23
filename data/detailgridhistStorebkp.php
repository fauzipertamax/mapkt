<?php
    session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "config.php";

	
	$idtiket=$_GET['id'];


		
	
	$sql="SELECT a.*,TO_CHAR(a.TANGGALLAPOR,'dd/mm/yyyy HH24:Mi:ss') AS TGL,
	'nyala' as KODESTATUS,
		       CASE 
         WHEN a.STATUS = 'Dalam Pengerjaan' THEN '1'
         WHEN a.STATUS = 'Nyala' THEN '2'
         WHEN a.STATUS = 'Nyala Sementara' THEN '3'
         ELSE  '0'
         END as image,
         CASE 
         WHEN a.STATUS = 'Dalam Pengerjaan' THEN 'pengerjaan.png'
		 WHEN a.STATUS = 'Nyala' THEN 'nyala.png'
		 WHEN a.STATUS = 'Nyala Sementara' THEN 'sementara.png'
         ELSE  'perjalanan.png'
         END as icon,
		 (select reguname from regu z where a.reguid=z.reguid) as namaregu,
         (select username from appuser x where a.user_id=x.userid) as username
  FROM MON_MOBILE_NEW2 a where a.id_tiket='".$idtiket."' order by id_tiket desc";
	
	 // echo $sql;
	 
			$sqlq=ociparse($conn,$sql);
			OCIEXECUTE($sqlq);

			$json['success'] = true;
			$json['data'] = array();
            while ($row = oci_fetch_array($sqlq)) {
			 $data['ID_TIKET'] = $row['ID_TIKET'];
			 $data['IDPEL'] = $row['IDPEL'];
			 $data['TGL'] = $row['TGL'];
			 $data['NAMAPELAPOR'] = $row['NAMAPELAPOR'];
			 $data['ALAMATPELAPOR'] = $row['ALAMATPELAPOR'];
			 $data['TELPPELAPOR'] = $row['TELPPELAPOR'];
			 $data['UNITNAME'] = $row['UNITNAME'];
			 $data['CAUSE'] = $row['CAUSE'];
			 $data['ACTION'] = $row['ACTION'];
			 $data['OLDSTATUS'] = $row['STATUS'];
			 $data['STATUS'] = $row['LASTSTATUS'];
			 $data['IMAGE'] = $row['IMAGE'];
			 $data['ICON'] = $row['ICON'];
			 $data['USERNAME'] = $row['USERNAME'];
			 $data['NAMAREGU'] = $row['NAMAREGU'];
			 $data['LATITUDE'] = floatval($row['LATITUDE']);
			 $data['LONGITUDE'] = floatval($row['LONGITUDE']);
			 $data['KSTATUS'] = $row['KODESTATUS'];
			 array_push($json['data'], $data);
			}
            echo json_encode($json);

oci_close($conn);
sleep(3);
?>