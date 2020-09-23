<?php
session_start();
error_reporting(E_ALL ^ E_NOTICE);
include('../../config.php');

$posko=$_POST['posko'];
$p_warna=$_POST['warna'];
$p_koordinat=$_POST['koordinat'];
$p_userid==$_SESSION['userid'];




// $clob = oci_new_descriptor($conn, OCI_D_LOB);
// $sql = 'BEGIN  :ret :=DASH_MAPKT.trm_marker(:posko, :p_warna, :p_koordinat, :p_userid, :ret); END;';
 $sql ="BEGIN DASH_MAPKT.trm_marker(:unitposko, :p_warna, :p_koordinat, :p_userid); END;";
        // $stmt = oci_parse($this->connection, $sql);

$stmt = oci_parse($conn, $sql);

// bind in and out variables

        oci_bind_by_name($stmt, ':unitposko', $posko);
        oci_bind_by_name($stmt, ':p_warna', $p_warna);
        oci_bind_by_name($stmt, ':p_koordinat', $p_koordinat);
        oci_bind_by_name($stmt, ':p_userid', $p_userid);

        //Execute the statement
        $check = oci_execute($stmt);

        if($check == true){
        $commit = oci_commit($conn);
   		 echo true;
        }else{
        $commit = oci_rollback($conn);
		    echo false;
		}






?>

