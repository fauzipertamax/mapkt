<script type="text/javascript" src="../extjs/examples/shared/include-ext.js"></script>
<body>
<script>
var idtiket="<?php echo $_GET['idtiket'];?>";
var alamat="<?php echo $_GET['alamat'];?>";
var status="<?php echo $_GET['status'];?>";

Ext.Loader.setConfig({
    enabled: true
});


Ext.onReady(function () {

Ext.create('Ext.form.Panel', {
    bodyPadding: 5,
    width: 400,
    layout: 'anchor',
    fieldDefaults: {
            labelAlign: 'right',
            labelWidth: 75,
            msgTarget: 'side'
        },
        items: [{
            xtype: 'fieldset',
            title: 'Regu Information',
            defaultType: 'textfield',
            defaults: {
                width: 350
            },
            items: [{
                fieldLabel: 'No. Lapor',
                value: idtiket, 
            }, {
				xtype:'textarea',
                fieldLabel: 'Alamat',
                value: alamat
            }, {
                fieldLabel: 'Status',
                value:status
            }]
        }],
    renderTo: Ext.getBody()
});

</script>
</body>
