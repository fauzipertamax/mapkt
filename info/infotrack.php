<script type="text/javascript" src="../extjs/examples/shared/include-ext.js"></script>
<body>
<script>
Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath('Ext.ux', 'extjs/examples/ux/');
Ext.require(['Ext.grid.*', 'Ext.data.*', 'Ext.util.*', 'Ext.toolbar.Paging']);

var idtiket="<?php echo $_GET['idtiket'];?>";
var alamat="<?php echo $_GET['alamat'];?>";
var status="<?php echo $_GET['status'];?>";
var nama="<?php echo $_GET['nama'];?>";
var telp="<?php echo $_GET['telp'];?>";
var idpel="<?php echo $_GET['idpel'];?>";
var cause="<?php echo $_GET['cause'];?>";
var action="<?php echo $_GET['action'];?>";



Ext.onReady(function () {

var rhistory = Ext.create('Ext.data.Store', {
    fields: ['NAMAREGU','STATUS','TGLEKSEKUSI'],
       proxy: {
        type: 'ajax',
        url: 'historynyala2.php?nolapor='+idtiket,
        reader: {
            type: 'json',
            root: 'ROW',
        }
    },
    autoLoad: true
});

	Ext.create('Ext.tab.Panel', {
	bodyPadding: '5 5 5 5',
	frame:true,
	width: 470,
	title:'Detil Pelanggan Padam',
	items:[{
	xtype:'form',
	title: 'Informasi Pelanggan',
	fieldDefaults: {
		labelAlign: 'right',
		labelWidth: 75,
		msgTarget: 'side'
	},
	defaults: {
		anchor: '95%'
	},
	items: [{
		xtype: 'textfield',
		fieldLabel: 'No. Lapor',
		value: idtiket,
	}, {
		xtype: 'textfield',
		fieldLabel: 'ID Pel',
		value: idpel,
	}, {
		xtype: 'textfield',
		fieldLabel: 'Pelapor',
		value: nama,
	}, {
		xtype: 'textarea',
		fieldLabel: 'Alamat',
		value: alamat,
		rows:2
	}, {
		xtype: 'textfield',
		fieldLabel: 'Telp',
		value: telp,
	}, {
		xtype: 'textarea',
		fieldLabel: 'Penyebab Padam',
		value: cause,
		rows:2
	}, {
		xtype: 'textarea',
		fieldLabel: 'Tindakan',
		value: action,
		rows:2
	}, {
		xtype: 'textfield',
		fieldLabel: 'Status',
		value: status
	}]
	},{
		xtype:'grid',
		height:190,
		title:'History Transaksi',
		loadMask: true,
		store:rhistory,
        columns: [{
            text: "Status",
            dataIndex: 'STATUS',
            flex: 1.2,
            sortable: true
        }, {
            text: "Tgl Update",
            dataIndex: 'TGLEKSEKUSI',
            flex: 1.2,
            sortable: false
        }, {
            text: "Regu",
            dataIndex: 'NAMAREGU',
            flex: 1,
            sortable: false
        }],
		}],
	renderTo: Ext.getBody()
	});
	});
</script>
</body>