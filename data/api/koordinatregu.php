<?php
session_start();
error_reporting(E_ALL ^ E_NOTICE);
include('../../config.php');

	$sessuser=$_SESSION['userid'];
	$regu=$_POST['regu'];
	$tgl=$_POST['tgl'];
	// $sesstipe=($_SESSION['tipe']!='null')? $_SESSION['tipe'] : '';


// echo $regu."<br>";	
// echo $tgl."<br>";

$clob = oci_new_descriptor($conn, OCI_D_LOB);
$sql = 'BEGIN  :ret :=DASH_MAPKT.koordinat_regu(:in_regu, :in_tgl); END;';


$stmt = oci_parse($conn,$sql);

// Bind the input parameter

oci_bind_by_name($stmt,":in_regu",$regu);
oci_bind_by_name($stmt,":in_tgl",$tgl);

// Bithe outseridarameter
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