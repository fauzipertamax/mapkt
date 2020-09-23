<?php
	session_start(); 
	error_reporting(E_ALL ^ E_NOTICE);
	  $db = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 10.14.152.174)(PORT = 1521)))(CONNECT_DATA=(SID=PLNADMIN)))" ;
  $conn=ocilogon("plnadmin","plnadmin","$db");
  if ($conn)
  {
  echo "";
  }
  else
  {
  echo "Koneksi Gagal";
  }
    $user = $_GET['var_usn'];
	function md5_base64 ( $data ) 
{ 
    return preg_replace('/=+$/','',base64_encode(pack('H*',md5($data)))); 
} 

    $pass = md5_base64($_GET['var_pwd']);

	
$curs = oci_new_cursor($conn);

 $stid = oci_parse($conn, 'begin PROC_DASH_CEKUSER(:bind0, :bind1, :bind2); end;');
 
 oci_bind_by_name($stid, ':bind0', $user, 30);
 oci_bind_by_name($stid, ':bind1', $pass, 30);
 oci_bind_by_name($stid, ':bind2', $curs,-1, OCI_B_CURSOR);
 
 oci_execute($stid);
 oci_execute($curs, OCI_DEFAULT);

oci_fetch_all($curs, $cursor, null, null, OCI_FETCHSTATEMENT_BY_ROW);
   
   print_r($cursor);

oci_free_statement($stid);
oci_free_statement($curs);
oci_close($conn);
?>