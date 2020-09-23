<?php
session_start();
error_reporting(E_ALL ^ E_NOTICE);

$db   = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 10.14.152.174)(PORT = 1521)))(CONNECT_DATA=(SID=PLNADMIN)))";
$conn = ocilogon("plnadmin", "plnadmin", "$db");

if ($conn) {
    echo "";
} else {
    echo "Koneksi Gagal";
}

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
	$search="AND a.".$jcari." = '" .$pcari. "' ";
	
	}else{
	$search="";
	}
	if(empty($p) && empty($c)){$unit="and a.distribusi=".$d."";}else
	if(empty($p) && !empty($c)){$unit="and a.area=".$c."";}else{
	$unit="and a.rayon_posko=".$p."";
	}
	}else{
		$periode= "and trunc(tanggallapor) between sysdate-3 and sysdate";
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

	$s = oci_parse($conn, "begin :ret :=DASH_MAPKT.GET_TRANSAKSIAKTIF(:ret, :ID_TIKET, :IDPEL, :TGL, :NAMAPELAPOR, :ALAMATPELAPOR, :TELPPELAPOR, :UNITNAME, :STATUS); end;");
oci_bind_by_name($s,":ID_TIKET", $ID_TIKET,30);
oci_bind_by_name($s,":IDPEL", $ID_PLG,30);
oci_bind_by_name($s,":TGL",$TGL,30);
oci_bind_by_name($s,":NAMAPELAPOR",$NAMAPELAPOR,30);
oci_bind_by_name($s,":ALAMATPELAPOR",$ALAMATPELAPOR,100);
oci_bind_by_name($s,":TELPPELAPOR",$TELPPELAPOR,30);
oci_bind_by_name($s,":UNITNAME",$UNITNAME,30);
oci_bind_by_name($s,":STATUS",$LASTSTATUS,30);
//oci_bind_by_name($s, ':bind0', $user, 300);
//oci_bind_by_name($s, ':bind1', $pass, 300);
oci_bind_by_name($s,":ret", $clob, -1, OCI_B_CLOB);
oci_execute($s);

$mylob = $clob->load();

$xml = simplexml_load_string($mylob) or die("Error: Cannot create object");
$json = json_encode($xml);
$json = json_decode($json, true);


					
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
	
 $query=" select * from(SELECT ID_TIKET,ID_PLG,TO_CHAR(TANGGALLAPOR,'dd/mm/yyyy HH24:Mi:ss') AS TGL,LATITUDE,LONGITUDE,NAMAPELAPOR,ALAMATPELAPOR,TELPPELAPOR,UNITNAME,LASTSTATUS,NOTIFIKASI,ROWNUM R
     FROM (".$s.")) 
     WHERE R BETWEEN ".$start." AND ".$end." ";
	 
	 //echo $query;
	 
			$sqlq=ociparse($conn,$query);
			OCIEXECUTE($sqlq);

			$json['success'] = true;
			$json['jumlah'] = $totaldata; 
			$json['data'] = array();
            while ($row = oci_fetch_array($sqlq)) {
			 $data['ID_TIKET'] = $json['row']['ID_TIKET'];
			 $data['IDPEL'] = $json['row']['ID_PLG'];
			 $data['TGL'] = $json['row']['TGL'];
			 $data['NAMAPELAPOR'] = $json['row']['NAMAPELAPOR'];
			 $data['ALAMATPELAPOR'] = $json['row']['ALAMATPELAPOR'];
			 $data['TELPPELAPOR'] = $json['row']['TELPPELAPOR'];
			 $data['UNITNAME'] = $json['row']['UNITNAME'];
			 $data['STATUS'] = $json['row']['LASTSTATUS'];
			 $data['LATITUDE'] = floatval($json['row']['LATITUDE']);
			 $data['LONGITUDE'] = floatval($json['row']['LONGITUDE']);
			 $data['NOTIFIKASI'] = $json['row']['NOTIFIKASI']; 
			 array_push($json['data'], $data);
			}
            echo json_encode($json);

oci_close($conn);
sleep(3);
?>