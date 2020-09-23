<?php
session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "../config.php";
	
	$kd_asset=$_GET['kode_asset'];
	$_SESSION['tema'] = "classic";
	
$clob = oci_new_descriptor($conn, OCI_D_LOB);
$sql = 'BEGIN  :ret :=DASH_MAPKT.gardis_padam_detail(:kd_asset); END;';


$stmt = oci_parse($conn,$sql);

// Bind the input parameter

oci_bind_by_name($stmt,":kd_asset",$kd_asset);


// Bind the output parameter
//oci_bind_by_name($stmt,":p_data",$data);
oci_bind_by_name($stmt,":ret", $clob, -1, OCI_B_CLOB);

oci_execute($stmt);



$mylob = $clob->load();

// var_dump($mylob);



$xml = simplexml_load_string($mylob);
$json = json_encode($xml);
echo $json;

oci_free_statement($stmt);
oci_close($conn);
?>