<?php
session_start();
error_reporting(E_ALL ^ E_NOTICE);

include('../../config.php');

$ID=$_POST['cid'];
$clob = oci_new_descriptor($conn, OCI_D_LOB);

$s = oci_parse($conn, "begin :ret :=DASH_MAPKT.GET_RAYON(:bind0); end;");
oci_bind_by_name($s, ':bind0', $ID, 300);
oci_bind_by_name($s, ":ret", $clob, -1, OCI_B_CLOB);
oci_execute($s);

$mylob = $clob->load();

 $xml = simplexml_load_string($mylob) or die("Error: Cannot create object");
 $json = json_encode($xml);
 echo $json;

$clob->free();
oci_free_statement($s);
oci_close($conn);
?>