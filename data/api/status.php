<?php
   // ini_set('max_execution_time', 30000);
session_start();
error_reporting(E_ALL ^ E_NOTICE);
include('../../config.php');
ini_set('MAX_EXECUTION_TIME', 40000);
	// $sessuser=$_SESSION['userid'];
$unitid=$_SESSION['unitid'];
$sesstipe=$_SESSION['tipe'];


// echo $unitid."<br>";
// echo $sesstipe."<br>";
   

$clob = oci_new_descriptor($conn, OCI_D_LOB);
$sql = 'BEGIN  :ret :=DASH_MAPKT.STATUS_PADAM(:in_unitid, :in_type); END;';



$stmt = oci_parse($conn,$sql);

// Bind the input parameter

oci_bind_by_name($stmt,":in_unitid",$unitid);
oci_bind_by_name($stmt,":in_type",$sesstipe);

// Bind the output parameter
//oci_bind_by_name($stmt,":p_data",$data);
oci_bind_by_name($stmt,":ret", $clob, -1, OCI_B_CLOB);

oci_execute($stmt);



$mylob = $clob->load();

// var_dump($mylob);



$xml = simplexml_load_string(utf8_encode($mylob));
$json = json_encode($xml);
echo $json;

oci_free_statement($stmt);
oci_close($conn);
?>