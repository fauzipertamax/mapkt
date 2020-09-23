Ext.define('sampleapp.App', {
    requires: [		
		'sampleapp.Track',
		
    ]
});

Ext.onReady(function () {

    Ext.tip.QuickTipManager.init();
	

    var viewport = Ext.create('Ext.Viewport', {
        layout: {
            type: 'border',
            padding: 5
        },
        defaults: {
            split: true
        },
        items: [
            {
            region: 'center',
            minHeight: 80,
            layout: 'card',
            id: 'center',
            activeItem: 0,
			            tbar: [{
                xtype: 'splitbutton',
                text: 'Transaksi',
				scale:'small',
				iconCls: 'dash',
                iconAlign: 'left',
				menu:[
                {
					text: 'Tracking',
					iconCls: 'dash',
					handler: function () {
                    var tabs = Ext.getCmp('idtab')
                    tb = tabs.child('#track');
                    if (tb != null) {
                        tabs.setActiveTab(tb);
                    } else {
                        Ext.fly('track')
                        var tab = tabs.add(
                            tabtrack
                        )
                        tabs.setActiveTab(tab);
                    }
					Ext.getCmp('cw').setVisible(true);
                }
				},{
					text: 'Tracking History',
					iconCls: 'dash',
					//disabled:true,
					id:'reguTracker',
					handler: function () {
                    var tabs = Ext.getCmp('idtab')
                    tb = tabs.child('#historytrack');
                    if (tb != null) {
                        tabs.setActiveTab(tb);
                    } else {
                        Ext.fly('historytrack')
                        var tab = tabs.add(
                            tabhistory
                        )
                        tabs.setActiveTab(tab);
                    }
                    //Ext.getCmp('cw').setVisible(true);
                }
				}]
            }, 
			
				
			
			
			{html:'<strong>User : ' + usrnme + '</strong>',disabled:true},
			{
                xtype: 'button',
                text: 'Keluar',
				scale:'small',
                iconCls: 'keluar',
                iconAlign: 'left',
				handler: function () {
                            var redirect = 'logout.php';
                            window.location = redirect;

                        }
            }],
            
			
		]
        }]
    });
	
	

	

})