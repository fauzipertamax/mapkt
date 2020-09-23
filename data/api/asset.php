<?php
   // ini_set('max_execution_time', 30000);
session_start();
error_reporting(E_ALL ^ E_NOTICE);
include('../../config.php');
//$sesuser=$_SESSION['userid'];
$in_dist=$_SESSION['dist'];
$in_area=$_SESSION['area'];
$in_unit=$_SESSION['poskoid'];

// echo $sesuser."<br>";	
//echo $in_dist."<br>";
// echo $in_area."<br>";
// echo $in_unit."<br>";

$clob = oci_new_descriptor($conn, OCI_D_LOB);
$sql = 'BEGIN  :ret :=DASH_MAPKT.gardis_padam(:in_dist, :in_area, :in_unit); END;';


$stmt = oci_parse($conn,$sql);

// Bind the input parameter

oci_bind_by_name($stmt,":in_dist",$in_dist);
oci_bind_by_name($stmt,":in_area",$in_area);
oci_bind_by_name($stmt,":in_unit",$in_unit);

// Bithe outseridarameter
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