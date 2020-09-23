<?php
    session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "../config.php";
	$sessuser=$_SESSION['unitid'];
	$sesstipe=$_SESSION['tipe'];
	
	$cari=$_GET['cari'];
	$awal=$_GET['periodawal'];
	$akhir=$_GET['periodakhir'];
	$jcari=$_GET['jcari'];
	$pcari=$_GET['pcari'];
	$d=$_GET['d'];
	$c=$_GET['c'];
	$p=$_GET['p'];
	

	if($cari==true){
	$periode= "and trunc(tanggallapor) between to_date('".$awal."','dd/mm/yyyy') and to_date('".$akhir."','dd/mm/yyyy')";
	if(!empty($jcari) && !empty($pcari)){
	//$search="AND UPPER(".$jcari.") like upper('%".$pcari."%')";
	$search="AND a.".$jcari." = '" .$pcari. "' ";

	}else{
	$search="";
	}
	if(empty($p) && empty($c)){$unit="and a.distribusi=".$d."";}else
	if(empty($p) && !empty($c)){$unit="and a.area=".$c."";}else{
	$unit="and a.rayon_posko=".$p."";
	//if(empty($p) && empty($c)){$unit="and distribusi=".$d."";}else
	//if(empty($p) && !empty($c)){$unit="and area=".$c."";}else{
	//$unit="and rayon_posko=".$p."";
	}
	}else{
		$periode= "and trunc(tanggallapor) between sysdate-7 and sysdate";
		$search="";
		if($sesstipe==2){
		$unit="and a.distribusi=".$_SESSION['dist']."";
		}else if($sesstipe==3){
		$unit="and a.area=".$_SESSION['area']."";
		}else if($sesstipe==4){
		$unit="and a.rayon_posko like '".$_SESSION['rayon']."%'";
		}else{
		$unit="and a.rayon_posko=".$_SESSION['unitid']."";
		}
	}

		
	
	$sql="SELECT a.*
  FROM MON_MOBILE_HISTORY a,(select max(id_trans) id_trans,id_tiket from MON_MOBILE_NEW b group by id_tiket) b
  where a.id_trans=b.id_trans and a.id_tiket=b.id_tiket ".$periode." ".$search." ".$unit." order by tanggallapor desc";
	
		$count="select count(*)CTR FROM (".$sql.")";							
		$sqlc=ociparse($conn,$count);
			OCIEXECUTE($sqlc);
					
		 if ($row1 = oci_fetch_assoc($sqlc)){
                $totaldata = $row1['CTR'];
            }

            $start = $_GET['start'];
            $end = $_GET['limit'];
            $i = 0;
            
            if ($start != $i){
                $end = $end + $start;
                $start = $start + 1;
            } 
	
 $query=" select * from(SELECT ID_TIKET,ID_PLG,TO_CHAR(TANGGALLAPOR,'dd/mm/yyyy HH24:Mi:ss') AS TGL,LATITUDE,LONGITUDE,NAMAPELAPOR,ALAMATPELAPOR,TELPPELAPOR,UNITNAME,LASTSTATUS,ROWNUM R
     FROM (".$sql."))
     WHERE R BETWEEN ".$start." AND ".$end." ";
	 
	 //echo $query;
	 
			$sqlq=ociparse($conn,$query);
			OCIEXECUTE($sqlq);

			$json['success'] = true;
			$json['jumlah'] = $totaldata; 
			$json['data'] = array();
            while ($row = oci_fetch_array($sqlq)) {
			 $data['ID_TIKET'] = $row['ID_TIKET'];
			 $data['IDPEL'] = $row['ID_PLG'];
			 $data['TGL'] = $row['TGL'];
			 $data['NAMAPELAPOR'] = $row['NAMAPELAPOR'];
			 $data['ALAMATPELAPOR'] = $row['ALAMATPELAPOR'];
			 $data['TELPPELAPOR'] = $row['TELPPELAPOR'];
			 $data['UNITNAME'] = $row['UNITNAME'];
			 $data['STATUS'] = $row['LASTSTATUS'];
			 $data['LATITUDE'] = floatval($row['LATITUDE']);
			 $data['LONGITUDE'] = floatval($row['LONGITUDE']);
			 array_push($json['data'], $data);
			}
            echo json_encode($json);

oci_close($conn);
sleep(3);
?>