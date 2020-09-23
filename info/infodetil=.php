<style> 

a#gambar img {
-webkit-transition: all 1s ease-in-out;
-moz-transition: all 1s ease-in-out; 
-o-transition: all 1s ease-in-out; 
-ms-transition: all 1s ease-in-out; 
}

a#gambar img:hover { 
-webkit-transform: rotate(90deg); 
-moz-transform: rotate(90deg); 
-o-transform: rotate(90deg);
-ms-transform: rotate(90deg); 
}

a#gambar {
float: left;
margin: 5px 60px;
}

</style>
<script type="text/javascript" src="../extjs/examples/shared/include-ext.js"></script>
<body center>
<script>
Ext.Loader.setConfig({
    enabled: true
});

var a="<?php echo $_GET['status'];?>";
var b="<?php echo $_GET['tgl'];?>";
var c="<?php echo $_GET['user'];?>";
var d="<?php echo $_GET['regu'];?>";
var e="<?php echo $_GET['gbr'];?>";
var f="<?php echo $_GET['nolapor'];?>";

if(e==0){
g='<div id="gambar"><img border=2 padding=1 width=225 height=267 src="no_photo.jpg" /></div>';
}else{
g='<a id="gambar"><img border=2 padding=1 width=245 height=276 src="../data/photo.php?img='+e+'&id='+f+'" /></a>'
}

Ext.onReady(function () {

Ext.create('Ext.tab.Panel', {
    bodyPadding: '5 5 5 5',
	frame:true,
    width: 390,
	items:[{
	xtype:'form',
	title: 'Detil Laporan',
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
              fieldLabel: 'Tgl Update',
                value: b,
				readOnly:true
            }, {
                fieldLabel: 'Regu Pelaksana',
                value: d,
				readOnly:true
            }, {
                fieldLabel: 'Username',
                value:c,
				readOnly:true
            }, {
                fieldLabel: 'Status',
                value: a,
				readOnly:true
            }]
		},{
		xtype:'panel',
		height:290,
		title:'Photo Lokasi',
		bodyPadding: '5 5 5 5',
        width: 390,
	    html:g,
		}],
    renderTo: Ext.getBody()
});
});

</script>
</body>