<script type="text/javascript" src="../extjs/examples/shared/include-ext.js?"></script>
<body>
<script>
Ext.Loader.setConfig({
    enabled: true
});

var username="<?php echo $_GET['dist'];?>";
var rd_unitname="<?php echo $_GET['area'];?>";
var rd_rayon="<?php echo $_GET['rayon'];?>";
var rd_lat="<?php echo $_GET['lat'];?>";
var rd_lng="<?php echo $_GET['lng'];?>";
var rd_waktu="<?php echo $_GET['waktu'];?>";
var rd_status="<?php echo $_GET['status'];?>";
var rd_jml="<?php echo $_GET['kode_asset'];?>";
var rd_coverage="<?php echo $_GET['cover'];?>";
var rd_tiang="<?php echo $_GET['tiang'];?>";
var rd_asset="<?php echo $_GET['jenis'];?>";


Ext.onReady(function () {

var rhistory = Ext.create('Ext.data.Store', {
    fields: ['REPORTNUMBER','LASTSTATUS'],
    pageSize: 5,
       proxy: {
        type: 'ajax',
        url: 'historyregu2.php?userid='+username,
        reader: {
            type: 'json',
            root: 'ROW',
            totalProperty: 'jumlah'
        }
    },
    autoLoad: true
});

Ext.create('Ext.tab.Panel', {
    bodyPadding: '5 5 5 5',
    frame:true,
    title:'Detail Gangguan',
    width: 450,
    items:[{
    xtype:'form',
    title: 'Informasi Gangguan',
    fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 75,
            msgTarget: 'side'
        },
            defaultType: 'textfield',
            defaults: {
                anchor: '98%'
            },
            items: [{
                fieldLabel: 'Distribusi',
                value: username,
                readOnly:true
            }, {
                fieldLabel: 'Area',
                value: rd_unitname,
                readOnly:true
            }, {
                fieldLabel: 'Rayon',
                value: rd_rayon,
                readOnly:true
            }, {
                fieldLabel: 'Koordinat',
                value:rd_lat+','+rd_lng,
                readOnly:true
            }, {
                fieldLabel: 'Waktu padam',
                value: rd_waktu,
                readOnly:true
            }, {
                fieldLabel: 'Status',
                value: rd_status,
                readOnly:true
            }, {
                fieldLabel: 'Area Padam',
                value: rd_coverage,
                readOnly:true
            },{
                fieldLabel: 'Nama Asset',
                value: rd_asset,
                readOnly:true
            },{
                fieldLabel: 'Nomor Tiang',
                value: rd_tiang,
                readOnly:true
            },{
                fieldLabel: 'kode asset',
                value: rd_jml,
                readOnly:true
            }]
        // },{
        // xtype:'grid',
        // height:190,
        // title:'History Transaksi',
        // loadMask: true,
        // store:rhistory,
        // columns: [{
        //     text: "No. Lapor",
        //     dataIndex: 'REPORTNUMBER',
        //     flex: 1.3,
        //     sortable: true
        // }, {
        //     text: "Status",
        //     dataIndex: 'LASTSTATUS',
        //     flex: 1,
        //     sortable: false
        // }],
        // bbar: Ext.create('Ext.PagingToolbar', {
        //     displayInfo: true,
        //     store:rhistory,
        //     displayMsg: '{2}',
        //     emptyMsg: "0",
        // }),
        }],
    renderTo: Ext.getBody()
});
});
</script>
</body>