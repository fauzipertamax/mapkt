<script type="text/javascript" src="../extjs/examples/shared/include-ext.js"></script>
<link rel="stylesheet" type="text/css" href="resources/css/my-ext-theme.css">
<script type="text/javascript" src="extjs/ext-debug.js"></script>
<script type="text/javascript" src="app.js"></script>
<body>
<script>
Ext.Loader.setConfig({
    enabled: true
});

var username="<?php echo $_GET['user'];?>";
var rd_unitname="<?php echo $_GET['unit'];?>";
var rd_userid="<?php echo $_GET['userid'];?>";
var rd_lat="<?php echo $_GET['lat'];?>";
var rd_lng="<?php echo $_GET['lng'];?>";
var rd_waktu="<?php echo $_GET['waktu'];?>";
var rd_status="<?php echo $_GET['status'];?>";
var rd_jml="<?php echo $_GET['jml'];?>";

Ext.onReady(function () {

var rhistory = Ext.create('Ext.data.Store', {
    fields: ['REPORTNUMBER','LASTSTATUS'],
    pageSize: 5,
       proxy: {
        type: 'ajax',
        url: 'historyregu2.php?userid='+rd_userid,
        reader: {
            type: 'json',
            root: 'ROW',
			totalProperty: 'jumlah'
        }
    },
    autoLoad: true
});

var rhistoryt = Ext.create('Ext.data.Store', {
    fields: ['REPORTNUMBER','LASTSTATUS'],
    pageSize: 5,
       proxy: {
        type: 'ajax',
        url: 'historyregu3.php?userid='+rd_userid,
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
	title:'Informasi Regu',
    width: 390,
	items:[{
	xtype:'form',
	title: 'Detail Regu',
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
                fieldLabel: 'Username',
                value: username,
				readOnly:true
            }, {
                fieldLabel: 'Unit',
                value: rd_unitname,
				readOnly:true
            }, {
                fieldLabel: 'Koordinat',
                value:rd_lat+','+rd_lng,
				readOnly:true
            }, {
                fieldLabel: 'Waktu catat',
                value: rd_waktu,
				readOnly:true
            }, {
                fieldLabel: 'Status',
                value: rd_status,
				readOnly:true
            }, {
                fieldLabel: 'Lap. dlm pengerjaan',
                value: rd_jml+'',
				readOnly:true
            }]
		},{
		xtype:'grid',
		height:190,
		title:'WO aktif',
		loadMask: true,
		store:rhistory,
        columns: [{
            text: "No. Lapor",
            dataIndex: 'REPORTNUMBER',
            flex: 1.3,
            sortable: true
        }, {
            text: "Status",
            dataIndex: 'LASTSTATUS',
            flex: 1,
            sortable: false
        }],
        bbar: Ext.create('Ext.PagingToolbar', {
            displayInfo: true,
			store:rhistory,
            displayMsg: '{2}',
            emptyMsg: "0",
        }),
		},{
        xtype:'grid',
        height:190,
        title:'Nyala Sementara',
        loadMask: true,
        store:rhistoryt,
        columns: [{
            text: "No. Lapor",
            dataIndex: 'REPORTNUMBER',
            flex: 1.3,
            sortable: true
        }, {
            text: "Status",
            dataIndex: 'LASTSTATUS',
            flex: 1,
            sortable: false
        }],
        bbar: Ext.create('Ext.PagingToolbar', {
            displayInfo: true,
            store:rhistoryt,
            displayMsg: '{2}',
            emptyMsg: "0",
        }),
        }],
    renderTo: Ext.getBody()
});
});
</script>
</body>