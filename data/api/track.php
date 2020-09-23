<?php
session_start();
error_reporting(E_ALL ^ E_NOTICE);
include('../../config.php');
ini_set('MAX_EXECUTION_TIME', 40000);

	$sesunit=$_SESSION['unitid'];
	$tipe=$_SESSION['tipe'];
	// $sesstipe=($_SESSION['tipe']!='null')? $_SESSION['tipe'] : '';


// echo $sesunit."<br>";	
// echo $tipe."<br>";

$clob = oci_new_descriptor($conn, OCI_D_LOB);
$sql = 'BEGIN  :ret :=DASH_MAPKT.track(:in_unitid, :in_type); END;';


$stmt = oci_parse($conn,$sql);

// Bind the input parameter

oci_bind_by_name($stmt,":in_unitid",$sesunit);
oci_bind_by_name($stmt,":in_type",$tipe);

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