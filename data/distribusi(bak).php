<?php


include('config.php');


$query = "SELECT unitid, initcap(unitname) as unitname FROM unit where unittypeid=2 and isactive = 1 ORDER by unitname ASC";
$result=OCIPARSE($conn,$query);
OCIEXECUTE($result);


// Test the query
if(!$result){
    $res = array('success' => false);
	echo json_encode($res);
    exit();
}


while ($row = oci_fetch_array($result, OCI_ASSOC)) {
	$distribusi[] = array(
        'UID' => $row['UNITID'],
        'UNAME' => $row['UNITNAME']
		);
}


$myData = array('success' => true, 'distribusi' => $distribusi);

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