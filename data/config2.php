<?php

$db = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521)))(CONNECT_DATA=(SID=ORCL)))" ;
$conn=ocilogon("pustaka","pustaka","$db");
if ($conn)
{
echo "";
}
else
{
echo "Koneksi Gagal";
}
?>