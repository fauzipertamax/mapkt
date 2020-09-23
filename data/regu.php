<?php
   session_start();
	error_reporting(E_ALL ^ E_NOTICE);

include('config.php');
$sessuser=$_SESSION['unitid'];


$query = "select reguid,initcap(reguname) as reguname,poskoid,initcap((select unitname from unit where regu.poskoid=unit.unitid)) as unitname from regu where isactive=1 and poskoid=".$sessuser."";
$result=OCIPARSE($conn,$query);
OCIEXECUTE($result);


// Test the query
if(!$result){
    $res = array('success' => false);
	echo json_encode($res);
    exit();
}


while ($row = oci_fetch_array($result, OCI_ASSOC)) {
	$regu[] = array(
        'REGUID' => $row['REGUID'],
        'REGUNAME' => $row['REGUNAME'],
		'POSKOID' => $row['POSKOID'],
		'UNITNAME' => $row['UNITNAME']
		);
}


$myData = array('success' => true, 'regu' => $regu);

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