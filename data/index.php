<?php

$db = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.69.12)(PORT = 33101)))(CONNECT_DATA=(SID=DBAPKT1)))" ;
$conn=ocilogon("PLNADMIN","PLNADMIN123","$db");
if ($conn)
{
echo "";
}
else
{
echo "Koneksi Gagal";
}
?>