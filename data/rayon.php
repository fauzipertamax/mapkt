<?php

// Begin stateQ.php

include('config.php');


$cb = $_POST['cid']; // This is sent to us from the continent drop down via the ajax request, after the user selects a continent

$query = "SELECT unitid, initcap(unitname) as unitname FROM unit WHERE unittypeid=4 and unitparent = '".$cb."' ORDER by unitname ASC";

$result = OCIPARSE($conn, $query); 
OCIEXECUTE($result);

// Test the query
if(!$result){
    $res = array('success' => false, 'error' => 'Whatever error message you want to display here.');
	echo json_encode($res);
    exit();
}


while ($row = oci_fetch_array($result, OCI_ASSOC)) {
	$rayon[] = array(
        'RID' => $row['UNITID'],
        'RNAME' => $row['UNITNAME']
		);
}


$myData = array('success' => true, 'rayon' => $rayon);

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