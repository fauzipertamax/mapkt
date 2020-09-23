<?php
session_start();
error_reporting(E_ALL ^ E_NOTICE);
include('../../config.php');

$jcari=($_GET['jcari']!='null')? $_GET['jcari'] : '';
$pcari=$_GET['pcari'];
$periodawal=$_GET['periodawal'];
$periodakhir=$_GET['periodakhir'];
$distribusi=$_SESSION['dist'];
$cabang=($_GET['c']!='null')? $_GET['c'] : '';
$posko=($_GET['p']!='null')? $_GET['p'] : $unitid;


// echo $jcari."<br>";
// echo $pcari."<br>";
// echo $periodawal."<br>";
// echo $periodakhir."<br>";
// echo $distribusi."<br>";
// echo $cabang."<br>";
// echo $posko."<br>";





$clob = oci_new_descriptor($conn, OCI_D_LOB);
$sql = 'BEGIN  :ret :=DASH_MAPKT.get_transaksi_histo_semuaunit(:were, :were2, :tgl_a, :tgl_b, :p_distribusi, :area, :posko); END;';



$stmt = oci_parse($conn,$sql);

// Bind the input parameter

oci_bind_by_name($stmt,":were",$jcari);
oci_bind_by_name($stmt,":were2",$pcari);
oci_bind_by_name($stmt,":tgl_a",$periodawal);
oci_bind_by_name($stmt,":tgl_b",$periodakhir);
oci_bind_by_name($stmt,":p_distribusi",$distribusi);
oci_bind_by_name($stmt,":area",$cabang);
oci_bind_by_name($stmt,":posko",$posko);
// Bind the output parameter
//oci_bind_by_name($stmt,":p_data",$data);
oci_bind_by_name($stmt,":ret", $clob, -1, OCI_B_CLOB);

oci_execute($stmt);

// $r = oci_execute($stmt);
// if (!$r) {
//     $e = oci_error($stid);  // For oci_execute errors pass the statement handle
//     print htmlentities($e['message']);
//     print "\n<pre>\n";
//     print htmlentities($e['sqltext']);
//     printf("\n%".($e['offset']+1)."s", "^");
//     print  "\n</pre>\n";
// }



$mylob = $clob->load();

// var_dump($mylob);



$xml = simplexml_load_string(utf8_encode($mylob));
$json = json_encode($xml);
echo $json;

oci_free_statement($stmt);
oci_close($conn);
?>