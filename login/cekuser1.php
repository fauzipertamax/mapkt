<?php
	session_start(); 
	error_reporting(E_ALL ^ E_NOTICE);
    $user = $_POST['var_usn'];
	function md5_base64 ( $data ) 
{ 
    return preg_replace('/=+$/','',base64_encode(pack('H*',md5($data)))); 
} 

    $pass = md5_base64($_POST['var_pwd']);

	include ("../config.php");
	$query = "SELECT username,unitid,unittypeid,userid,employeename,areaid,rayonid,rayonname,
	f_get_UnitDistribusi_unitid(rayonid) as distribusiid,
       (select unitname from unit where unitid= f_get_UnitDistribusi_unitid(rayonid) ) as distribusiname
  FROM (
  SELECT a.username,
               a.unitid,
               (SELECT unitparent FROM unit c WHERE a.unitid = c.unitid) AS areaid,
               (SELECT unittypeid FROM unit b WHERE a.unitid = b.unitid) AS unittypeid,
               a.userid, employeename,
               (SELECT unitid FROM unit b WHERE SUBSTR (a.unitid, 1, 5) = SUBSTR (b.unitid, 1, 5)
               AND b.unittypeid = 4 AND b.isactive = 1) AS rayonid,
				(SELECT unitname FROM unit b WHERE SUBSTR (a.unitid, 1, 5) = SUBSTR (b.unitid, 1, 5)
               AND b.unittypeid = 4
               AND b.isactive = 1)AS rayonname
				FROM appuser a where isactive=1  and 
				upper(a.username)=upper('".$user."') 
				and a.password='".$pass."==')";
		 
		 // echo $query;
	
    $result = OCIParse($conn, $query);
	OCIexecute($result);
	
	$tmpcount = OCIFetch($result);
	
	$hasil = OCIParse($conn, $query);
	OCIexecute($hasil);
	while ($row = oci_fetch_array($hasil)) {
	$unitid=$row['UNITID'];
	$userid=$row['USERID'];
	$uselkp=$row['EMPLOYEENAME'];
	$tipe=$row['UNITTYPEID'];
	$poskoid=$row['UNITID'];
	$rayonid=$row['RAYONID'];
	$area=$row['AREAID'];
	$dist=$row['DISTRIBUSIID'];
	}
	/* if($tipe==2){
	$a="distribusiid";$q="where distribusiid=".$unitid."";}else if($tipe==3){
	$a="distribusiid,areaid";$q="where areaid=".$unitid."";}else if($tipe==4){
	$a="distribusiid,areaid,rayonid";$q="where rayonid=".$unitid."";}else{
	$a="distribusiid,areaid,poskoid";$q="where poskoid=".$unitid."";
	}
	$query2 = "select ".$a." from (SELECT a.unitid as poskoid,
       a.unitname as poskoname,
       (SELECT unitid
          FROM unit b
         WHERE     SUBSTR (a.unitid, 1, 5) = SUBSTR (b.unitid, 1, 5)
               AND b.unittypeid = 4
               AND b.isactive = 1)
          AS rayonid,
       (SELECT unitname
          FROM unit b
         WHERE     SUBSTR (a.unitid, 1, 5) = SUBSTR (b.unitid, 1, 5)
               AND b.unittypeid = 4
               AND b.isactive = 1)
          AS rayonname,
       (SELECT unitid
          FROM unit c
         WHERE     a.unitparent = c.unitid
               AND c.unittypeid = 3
               AND c.isactive = 1)
          AS areaid,
       (SELECT unitname
          FROM unit c
         WHERE     a.unitparent = c.unitid
               AND c.unittypeid = 3
               AND c.isactive = 1)
          AS areaname,
       (SELECT unitid
          FROM unit d
         WHERE d.unitid =
                  (SELECT unitparent
                     FROM unit c
                    WHERE     a.unitparent = c.unitid
                          AND c.unittypeid = 3
                          AND c.isactive = 1)
               AND isactive = 1
               AND unittypeid = 2)
          AS distribusiid,
       (SELECT unitname
          FROM unit d
         WHERE d.unitid =
                  (SELECT unitparent
                     FROM unit c
                    WHERE     a.unitparent = c.unitid
                          AND c.unittypeid = 3
                          AND c.isactive = 1)
               AND isactive = 1
               AND unittypeid = 2)
          AS distribusiname
  FROM unit a
 WHERE a.isactive = 1 AND a.unittypeid = 5 and a.unitname not like 'CC123%') ".$q." "; */
 
 		  // echo $query2;
	
/*     $result2 = OCIParse($conn, $query2);
	OCIexecute($result2);
	while ($row1 = oci_fetch_array($result2)) {
	$poskoid=$row1['POSKOID'];
	$rayonid=$row1['RAYONID'];
	$area=$row1['AREAID'];
	$dist=$row1['DISTRIBUSIID'];
	}
	 */

if ($tmpcount==1){
     $_SESSION['username'] = $user;
	 $_SESSION['unitid'] = $poskoid;
	 $_SESSION['userid'] = $userid;
	 $_SESSION['userlkp'] = $uselkp;
	 $_SESSION['tipe'] = $tipe;
	 $_SESSION['area'] = $area;
	 $_SESSION['dist'] = $dist;
	 $_SESSION['rayon'] = $rayonid;
	 // $_SESSION['tema'] = $_POST['var_tma'];
	 $_SESSION['tema'] = "neptune";
	 echo "ok";
	}
oci_close($conn);
?>