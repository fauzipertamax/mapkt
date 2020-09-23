<?php
session_start();
	error_reporting(E_ALL ^ E_NOTICE);
	include "../config.php";
	
	$userid=$_GET['userid'];
	
	$sql=" SELECT *
  FROM (SELECT a.reportnumber,
               a.reguid,
               a.createdate,
               n.laststatus
          FROM failure a, runworkflow n
         WHERE a.runworkflowid = n.runworkflowid)
 WHERE reguid IN (SELECT reguid
                    FROM regumember
                   WHERE userid = ".$userid.")
       AND TRUNC (CREATEDATE) >= SYSDATE - 24/24";
	
	  $sqlc=ociparse($conn,$sql);
			OCIEXECUTE($sqlc);
			

						
	$count="select count(*)total from (".$sql.")";
	$sqlc=ociparse($conn,$count);
			OCIEXECUTE($sqlc);
			
			if ($row1 = oci_fetch_assoc($sqlc)){
                $totaldata = $row1['TOTAL'];
            }

            $start = $_GET['start'];
            $end = $_GET['limit'];
            $i = 0;
            
            if ($start != $i){
                $end = $end + $start;
                $start = $start + 1;
            } 
			
			$sqla="select * from(select reportnumber,laststatus,rownum R from (".$sql.")) WHERE R BETWEEN ".$start." AND ".$end."";
			
	
	  $sqlq=ociparse($conn,$sqla);
			OCIEXECUTE($sqlq);
			

			$json['success'] = true;
			$json['jumlah'] = $totaldata; 
			$json['data'] = array();
            while ($row = oci_fetch_array($sqlq)) {
			 $data['reportnumber'] = $row['REPORTNUMBER'];
			 $data['status'] = $row['LASTSTATUS'];
			 array_push($json['data'], $data);
			}
            echo json_encode($json);

?>