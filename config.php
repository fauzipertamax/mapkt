<?php


 //$db = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.69.12)(PORT = 33101)))(CONNECT_DATA=(SID=DBAPKT1)))" ;
 //$conn=ocilogon("PLNADMIN","ICONPLUSADMIN","$db");
 //if ($conn)
 //{
 //echo "";
 //}
 //else
 //{
 //echo "Koneksi Gagal";
 //}

 $db = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 10.14.152.4)(PORT = 1598)))(CONNECT_DATA=(SID=CISQA)))" ;
 $conn=ocilogon("M_APKT","MAPKT","$db");
  if ($conn)
  {
 echo "";
  }
  else
  {
  echo "Koneksi Gagal";
  }

// $db = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.69.12)(PORT = 33101)))(CONNECT_DATA=(SID=DBAPKT1)))" ;
// $conn=ocilogon("PLNADMIN","ICONPLUSADMIN","$db");
// if ($conn)
// {
// echo "";
// }
// else
// {
// echo "Koneksi Gagal";
// }

// $db = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.211.11)(PORT = 1521)))(CONNECT_DATA=(SID=DBAPKT)))" ;
 // $conn=ocilogon("plnadmin","plnadmin","$db");
 // if ($conn)
 // {
 // echo "";
// }
 // else
 // {
 // echo "Koneksi Gagal";
 // }

// $db = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.10.21)(PORT = 1521)))(CONNECT_DATA=(SID=DBUAT)))" ;
// $conn=ocilogon("plnadmin","plnadmin","$db");
// if ($conn)
// {
// echo "";
// }
// else
// {
// echo "Koneksi Gagal";
// }
?>
