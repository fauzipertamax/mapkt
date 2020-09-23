<?php


include('config.php');

$ID=$_POST['uid'];
$query = " SELECT unitid,
         unitcode,
         INITCAP (unitname) AS unitname,
         unitparent
    FROM unit
   WHERE     unittypeid = 3
         AND unitcode != 'CC123'
         AND isactive = 1
         AND unitparent = ".$ID."
         AND unitid IN (SELECT distinct(unitparent) as unitparent
          FROM unit
         WHERE isactive = 1 AND unittypeid in (4,5))
         AND unitid not in (26,24,25,507)
ORDER BY unitname ASC";
$result=OCIPARSE($conn,$query);
OCIEXECUTE($result);


// Test the query
if(!$result){
    $res = array('success' => false, 'error' => 'Whatever error message you want to display here.');
	echo json_encode($res);
    exit();
}


while ($row = oci_fetch_array($result, OCI_ASSOC)) {
	$cabang[] = array(
        'CID' => $row['UNITID'],
        'CNAME' => $row['UNITNAME']
		);
}


$myData = array('success' => true, 'cabang' => $cabang);

echo json_encode($myData);

oci_close($conn);
// $conn is no long usable in the script but the underlying database
// connection is still held open until $stid is freed.

// When $stid is freed, the database connection is physically closed
oci_free_statement($result);  

// While PHP sleeps, querying the Oracle V$SESSION view in a
// terminal window will show that the database user has disconnected.
sleep(3);
?>