    <style type="text/css">
        #the-table {
            border:0px solid #bbb;
            border-collapse:collapse;
			valign: middle;
			font-size:75%;
        }
        #the-table td,#the-table th {
            border:0px solid #ccc;
            border-collapse:collapse;
			valign: middle;
            padding:1px;
        }
    </style>
<?PHP
error_reporting(E_ALL ^ E_NOTICE);
include "oracle.php";

$unit=$_GET['id'];
$tahun=$_GET['tahun'];
$nama_unit=$_GET['title'];

$sql = "select jumlah,NVL(Dalam_Proses,0)dalam_proses,NVL(selesai,0)selesai,NVL(dibatalkan,0)dibatalkan from(select count(*)jumlah,
SUM (DECODE (LASTSTATUS, 'Dibatalkan', 1, 0)) Dibatalkan,
(SUM (DECODE (LASTSTATUS, 'Lapor', 1, 0))+
SUM (DECODE (LASTSTATUS, 'Menunggu Konfirmasi', 1, 0)) +
SUM (DECODE (LASTSTATUS, 'Penugasan Regu', 1, 0)) +
SUM (DECODE (LASTSTATUS, 'Dalam Perjalanan', 1, 0))+
SUM (DECODE (LASTSTATUS, 'Dalam Pengerjaan', 1, 0)))Dalam_Proses,
(SUM (DECODE (LASTSTATUS, 'Nyala Sementara', 1, 0))+
SUM (DECODE (LASTSTATUS, 'Nyala', 1, 0))+
SUM (DECODE (LASTSTATUS, 'Selesai(PEMADAMAN MELUAS)', 1, 0)) +
SUM (DECODE (LASTSTATUS, 'Selesai(GANGGUAN SISTEM)', 1, 0)) +
SUM (DECODE (LASTSTATUS, 'Selesai(PEMADAMAN TERENCANA)', 1, 0))+
SUM (DECODE (LASTSTATUS, 'Selesai', 1, 0))) Selesai from
( SELECT LASTSTATUS,
          TASKCREATEDATE,
          DISTRIBUTION,
          UNITID,
          unitparent
     FROM (SELECT RUNWORKFLOWID,
                  LASTSTATUS,
                  LASTSTATUSTYPE,
                  WORKFLOWID,
                  PROJECTID,
                  runtaskid,
                  TASKCREATEDATE,
                  TASKUPDATEDATE,
                  REQUESTDATE,
                  FORMNAME,
                  ROLEID,
                  COMMENTS,
                  CUSTOMERNUMBER,
                  nometer,
                  REPORTNUMBER,
                  REPORTERNAME,
                  REPORTERADDRESS,
                  BEGINDATE,
                  duration,
                  REPORTERPHONE,
                  DESCRIPTION,
                  SUMMARY,
                  UNITNAME,
                  LOCATION,
                  NEARESTSTREET,
                  CONFIRMATIONDATE,
                  ISCONFIRMATION,
                  PRIORITYID,
                  CAUSE,
                  priorityname,
                  CREATEDATE,
                  FINISHDATE,
                  LAPOR,
                  DISTRIBUTION,
                  UPDATEBY,
                  username,
                  CREATENAME,
                  keterangan,
                  unitid,
                  unitparent
             FROM (SELECT a.RUNWORKFLOWID,
                          a.LASTSTATUS,
                          a.LASTSTATUSTYPE,
                          a.WORKFLOWID,
                          a.PROJECTID,
                          a.RUNTASKID,
                          a.TASKCREATEDATE,
                          a.TASKUPDATEDATE,
                          a.createdate REQUESTDATE,
                          (SELECT formname
                             FROM WORKFLOWDETAIL b
                            WHERE b.WORKFLOWDETAILID = a.WORKFLOWDETAIL)
                             formname,
                          (SELECT roleid
                             FROM WORKFLOWDETAIL b
                            WHERE b.WORKFLOWDETAILID = a.WORKFLOWDETAIL)
                             roleid,
                          a.COMMENTS,
                          a.CUSTOMERNUMBER,
                          a.NOMETER,
                          a.REPORTNUMBER,
                          a.REPORTERNAME,
                          a.REPORTERADDRESS,
                          a.BEGINDATE,
                          CASE
                             WHEN a.laststatus NOT IN
                                     ('Nyala',
                                      'Idem Selesai',
                                      'Selesai(GANGGUAN SISTEM)',
                                      'Selesai(PEMADAMAN TERENCANA)',
                                      'Selesai(PEMADAMAN MELUAS)',
                                      'Selesai')
                             THEN
                                getduration (a.createdate, SYSDATE)
                             ELSE
                                getduration (a.CREATEDATE, a.updatedate)
                          END
                             DURATION,
                          a.REPORTERPHONE,
                          a.DESCRIPTION,
                          a.SUMMARY,
                          a.UNITNAME,
                          a.LOCATION,
                          a.NEARESTSTREET,
                          a.CONFIRMATIONDATE,
                          a.ISCONFIRMATION,
                          a.PRIORITYID,
                          a.CAUSE,
                          a.PRIORITYNAME,
                          a.CREATEDATE,
                          CASE
                             WHEN a.laststatus IN
                                     ('Nyala',
                                      'Idem Selesai',
                                      'Selesai(GANGGUAN SISTEM)',
                                      'Selesai(PEMADAMAN TERENCANA)',
                                      'Selesai(PEMADAMAN MELUAS)',
                                      'Selesai')
                             THEN
                                a.updatedate
                             ELSE
                                NULL
                          END
                             FINISHDATE,
                          a.LAPOR,
                          a.DISTRIBUTION,
                          a.UPDATEBY,
                          a.KETERANGAN,
                          a.UNITID,
                          a.unitparent,
                          a.USERNAME USERNAME,
                          a.CREATENAME CREATENAME
                     FROM (SELECT b.RUNWORKFLOWID RUNWORKFLOWID,
                                  1 PROJECTID,
                                  (SELECT runtaskid
                                     FROM runtask a
                                    WHERE a.runworkflowid = b.runworkflowid
                                          AND a.isdone = 0
                                          AND ROWNUM = 1)
                                     runtaskid,
                                  b.CREATEDATE TASKCREATEDATE,
                                  b.UPDATEDATE TASKUPDATEDATE,
                                  b.createdate REQUESTDATE,
                                  (SELECT TO_CHAR (a.comments)
                                     FROM runtask a
                                    WHERE a.runworkflowid = b.runworkflowid
                                          AND a.isdone = 0
                                          AND ROWNUM = 1)
                                     comments,
                                  B.CUSTOMERNUMBER CUSTOMERNUMBER,
                                  B.nometer nometer,
                                  B.REPORTNUMBER REPORTNUMBER,
                                  B.REPORTERNAME REPORTERNAME,
                                  B.REPORTERADDRESS REPORTERADDRESS,
                                  B.BEGINDATE BEGINDATE,
                                  0 AS duration,
                                  B.REPORTERPHONE REPORTERPHONE,
                                  TO_CHAR (B.DESCRIPTION) DESCRIPTION,
                                  TO_CHAR (B.SUMMARY) SUMMARY,
                                  B.UNITNAME UNITNAME,
                                  B.LOCATION LOCATION,
                                  B.NEARESTSTREET NEARESTSTREET,
                                  B.CONFIRMATIONDATE CONFIRMATIONDATE,
                                  B.ISCONFIRMATION ISCONFIRMATION,
                                  1 PRIORITYID,
                                  TO_CHAR (B.CAUSE) CAUSE,
                                  B.priorityname priorityname,
                                  b.CREATEDATE CREATEDATE,
                                  b.updatedate updatedate,
                                  B.KETERANGAN keterangan,
                                  b.poskoid UNITID,
                                  b.unitparent UNITPARENT,
                                  '0' AS FINISHDATE,
                                  B.LAPOR LAPOR,
                                  B.DISTRIBUTION DISTRIBUTION,
                                  (SELECT updateby
                                     FROM runtask a
                                    WHERE a.runworkflowid = b.runworkflowid
                                          AND a.isdone = 0
                                          AND ROWNUM = 1)
                                     updateby,
                                  (SELECT WORKFLOWDETAIL
                                     FROM runtask a
                                    WHERE a.runworkflowid = b.runworkflowid
                                          AND a.isdone = 0
                                          AND ROWNUM = 1)
                                     WORKFLOWDETAIL,
                                  (SELECT username
                                     FROM appuser a
                                    WHERE a.userid = b.updateby)
                                     USERNAME,
                                  (SELECT EMPLOYEENAME
                                     FROM appuser a
                                    WHERE a.userid = b.updateby)
                                     CREATENAME,
                                  (SELECT workflowid
                                     FROM runworkflow a
                                    WHERE a.runworkflowid = b.runworkflowid)
                                     workflowid,
                                  (SELECT LASTSTATUSTYPE
                                     FROM runworkflow a
                                    WHERE a.runworkflowid = b.runworkflowid)
                                     LASTSTATUSTYPE,
                                  (SELECT laststatus
                                     FROM runworkflow a
                                    WHERE a.runworkflowid = b.runworkflowid)
                                     laststatus
                             FROM failure b
                            WHERE b.distribution =".$unit."
                                  AND flaghisto = 0) a
                    WHERE EXISTS
                             (SELECT 1
                                FROM runtask b
                               WHERE a.runworkflowid = b.runworkflowid)
                          AND EXISTS
                                 (SELECT 1
                                    FROM appuser e
                                   WHERE a.updateby = e.userid)
                          AND EXISTS
                                 (SELECT 1
                                    FROM runworkflow b
                                   WHERE a.runworkflowid = b.runworkflowid
                                         AND b.LASTSTATUS <> 'Selesai'
                                         AND b.LASTSTATUSTYPE <> 'Complete'))
           UNION ALL
           SELECT *
             FROM (SELECT RUNWORKFLOWID,
                          LASTSTATUS,
                          LASTSTATUSTYPE,
                          WORKFLOWID,
                          PROJECTID,
                          runtaskid,
                          TASKCREATEDATE,
                          TASKUPDATEDATE,
                          REQUESTDATE,
                          FORMNAME,
                          ROLEID,
                          COMMENTS,
                          CUSTOMERNUMBER,
                          nometer,
                          REPORTNUMBER,
                          REPORTERNAME,
                          REPORTERADDRESS,
                          BEGINDATE,
                          duration,
                          REPORTERPHONE,
                          DESCRIPTION,
                          SUMMARY,
                          UNITNAME,
                          LOCATION,
                          NEARESTSTREET,
                          CONFIRMATIONDATE,
                          ISCONFIRMATION,
                          PRIORITYID,
                          CAUSE,
                          priorityname,
                          CREATEDATE,
                          FINISHDATE,
                          LAPOR,
                          DISTRIBUTION,
                          UPDATEBY,
                          username,
                          CREATENAME,
                          keterangan,
                          unitid,
                          unitparent
                     FROM tbl_gg_histo a
                    WHERE a.distribution = ".$unit.") a
            WHERE     EXISTS
                         (SELECT 1
                            FROM histruntask b
                           WHERE a.runworkflowid = b.runworkflowid)
                  AND EXISTS
                         (SELECT 1
                            FROM appuser e
                           WHERE a.updateby = e.userid)
                  AND EXISTS
                         (SELECT 1
                            FROM histrunworkflow f
                           WHERE a.runworkflowid = f.runworkflowid))))"; 
/*echo $sql;     */   
$data= oci_parse($conn,$sql);                          
oci_execute($data);

while ($data2 = oci_fetch_array($data, OCI_BOTH)){
echo "<table width='100%' align='left' id='the-table'>";
echo "<th colspan=2><b>".$nama_unit."</b></th></tr>";
echo "<tr align='left'><td align='left'>Jumlah Gangguan</td><td align='left' ><b>: ".$data2['JUMLAH']."</b></td></tr>";
echo "<tr align='left'><td align='left'>Proses Penyelesaian</td><td align='left' ><b>: ".$data2['DALAM_PROSES']."</b></td></tr>";
echo "<tr align='left'><td align='left'>Selesai</td><td align='left' ><b>: ".$data2['SELESAI']."</b></td></tr>";
echo "<tr align='left'><td align='left'>Batal</td><td align='left' ><b>: ".$data2['DIBATALKAN']."</b></td></tr>";
echo "</table>";
}

?>


