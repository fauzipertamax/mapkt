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
$user = $_POST['var_usn'];
function md5_base64($data)
{
    return preg_replace('/=+$/', '', base64_encode(pack('H*', md5($data))));
}

$pass = md5_base64($_POST['var_pwd']);
$pass = $pass . "==";

$clob = oci_new_descriptor($conn, OCI_D_LOB);

$s = oci_parse($conn, "begin :ret :=DASH_MAPKT.GET_CARIUSER(:bind0, :bind1); end;");
oci_bind_by_name($s, ':bind0', $user, 300);
oci_bind_by_name($s, ':bind1', $pass, 300);
oci_bind_by_name($s, ":ret", $clob, -1, OCI_B_CLOB);
oci_execute($s);

$mylob = $clob->load();

$xml = simplexml_load_string($mylob) or die("Error: Cannot create object");
$json = json_encode($xml);
$json = json_decode($json, true);

$username  = $json['ROW']['USER'];
$userid  = $json['ROW']['USERID'];
$uselkp  = $json['ROW']['EMPLOYEENAME'];
$tipe    = $json['ROW']['UNITTYPEID'];
$area    = $json['ROW']['AREAID'];
$dist    = $json['ROW']['DISTRIBUSIID'];
$rayonid = $json['ROW']['RAYONID'];
$poskoid = $json['ROW']['UNITID'];

if ($json) {
    $_SESSION['username'] = $user;
    $_SESSION['unitid']   = $poskoid;
    $_SESSION['userid']   = $userid;
    $_SESSION['userlkp']  = $uselkp;
    $_SESSION['tipe']     = $tipe;
    $_SESSION['posko']    = $poskoid;
    $_SESSION['area']     = $area;
    $_SESSION['dist']     = $dist;
    $_SESSION['rayon']    = $rayonid;
    $_SESSION['tema']     = "neptune";
    echo "ok";
}

$clob->free();
oci_free_statement($s);
oci_close($conn);
?>

