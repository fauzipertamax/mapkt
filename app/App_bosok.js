Ext.define('MyDesktop.App', {
    requires: [
		'MyDesktop.Draw',
		'MyDesktop.Mark',
		'MyDesktop.Track',
		'MyDesktop.HistoryTrack',
		'MyDesktop.Grid',
		'MyDesktop.GridHistory',
    ]
});

Ext.onReady(function () {

    Ext.tip.QuickTipManager.init();
	

    // Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
    // var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Loading Google Map..."});

    var viewport = Ext.create('Ext.Viewport', {
        layout: {
            type: 'border',
            padding: 5
        },
        defaults: {
            split: true
        },tems: [{
            region: 'north',
            split: true,
            height: 50,
            minHeight: 50,
            id: 'header',
            bodyStyle: 'background-image: url(resources/img/head.jpg);background-size:100%;background-repeat:no-repeat;',
        }, 
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
				menu:[{
					text: 'Transaksi Aktif',
					iconCls: 'mobile',
					handler: function () {
                    var tabs = Ext.getCmp('idtab')
                    tb = tabs.child('#grid');
                    if (tb != null) {
                        tabs.setActiveTab(tb);
						dataStore.load();
                    } else {
                        var tab = tabs.add(
                            tabgrid
                        )
                        tabs.setActiveTab(tab);
						dataStore.load({
                                    scope: this,
                                    callback: function () {
                                        Ext.getCmp('griddata').setLoading(false)
                                    }
                                });

                    }
                }
				},{
					text: 'Transaksi History',
					iconCls: 'mobile',
					disabled:false,
					id:'transhistory',
					handler: function () {
                    var tabs = Ext.getCmp('idtab')
                    tb = tabs.child('#gridhistory');
                    if (tb != null) {
                        tabs.setActiveTab(tb);
						dataHistStore.load();
                    } else {
                        var tab = tabs.add(
                            tabhistgrid
                        )
                        tabs.setActiveTab(tab);
						dataHistStore.load({
                                    scope: this,
                                    callback: function () {
                                        Ext.getCmp('histgriddata').setLoading(false)
                                    }
                                });

                    }
                }
				}]
            },	
			{
                xtype: 'splitbutton',
                text: 'Regu Tracker',
				scale:'small',
				iconCls: 'dash',
                iconAlign: 'left',
				menu:[{
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
            },{
                xtype: 'splitbutton',
                text: 'Draw & Mark',
				scale:'small',
				iconCls: 'dash',
                iconAlign: 'left',
				menu:[{
					text: 'Draw Area',
					id:'drawareabtn',
					iconCls: 'dash',
					handler: function () {
                    var tabs = Ext.getCmp('idtab')
                    tb = tabs.child('#draw');
                    if (tb != null) {
                        tabs.setActiveTab(tb);
                    } else {
                        // Ext.fly('RT')
                        var tab = tabs.add(
                            tabdraw
                        )
                        tabs.setActiveTab(tab);
                    }
                }
				},{
					text: 'Mark Office',
					iconCls: 'dash',
					handler: function () {
                    var tabs = Ext.getCmp('idtab')
                    tb = tabs.child('#mark');
                    if (tb != null) {
                        tabs.setActiveTab(tb);
                    } else {
                        // Ext.fly('RT')
                        var tab = tabs.add(
                            tabmark
                        )
                        tabs.setActiveTab(tab);
                    }
                }
				}]
            }, '->', ,
			
			
			
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
            items: [{
                xtype: 'tabpanel',
                id: 'idtab',
                width: '100%',
                height: 800,
                layout: 'fit',
                autoDestroy: false,
                items: [{
                    xtype: 'panel',
                    title: 'Dashboard',
                    id: 'mybox',
                    layout: 'fit',
                    listeners: {
                        'afterrender': function () {
                            // var myMask = new Ext.LoadMask(this.container, {msg:"Loading Google Map..."});
                            // myMask.show();

                            this.setLoading(true)
                        }
                    },
                    items: [{
                        xtype: 'gmappanel',
                        id: 'mymap',
                        layout: 'fit',
                        zoomLevel: 5,
                        gmapType: 'hmap',
                        mapConfOpts: ['enableScrollWheelZoom', 'enableDoubleClickZoom', 'enableDragging'],
                        mapControls: ['GSmallMapControl', 'GMapTypeControl'],
                        setCenter: {
                            lat: -2.51515,
                            lng: 117.58667
                        },
                        listeners: {
                            'mapready': function (map) {
                                unitMarkers = new Array();
                                for (var i = 0; i < dtStore.data.items.length; i++) {
                                    unitMarkers.push({
                                        "lat": dtStore.data.items[i].data.Lat,
                                        "lng": dtStore.data.items[i].data.Lng,
                                        "title": dtStore.data.items[i].data.Title,
                                        "marker": {
                                            "icon": 'resources/img/poweroutage.png',
                                            // "infoWindow": {
                                            // content: '<div id="divLoading"><img src="resources/img/loading.gif" alt="" /></div><div id="divFrameHolder" style="overflow:hidden;"><iframe onload="hideLoading()" " src="data/all.php?tahun=' + yyyy + '&id=' + dtStore.data.items[i].data.PID + '&title=' + dtStore.data.items[i].data.Title + '" frameborder="0" style="overflow:hidden;font-family:Arial, Helvetica, sans-serif;margin: 0px;"></div>'
                                            // }
                                        }
                                    });
                                }

                                this.addMarkers(unitMarkers)
                                // var myMask = new Ext.LoadMask(this.container, {msg:"Loading Google Map..."});
                                // myMask.hide();
                                Ext.getCmp('mybox').setLoading(false)
                            }
                        }
                        // markers: shipMarkers,
                    }]
                }]
            },
			
		    ]
        }]
    });
	
	var emergencyStore=Ext.create('Ext.data.Store', {
	fields: ['NO_EMERGENCY', 'NO_IMEI', 'USERID', 'UNITID', 'MESSAGE', 'SEND_DATA', 'CLOSE_DATE', 'STATUS', 'REGUID'],
    proxy: {
        type: 'ajax',
        url: 'data/emergency.php',
        reader: {
            type: 'json',
            root: 'data',
        }
    },
	autoLoad:false,
	 listeners: {
     'load': function (a, b) {
	 if(b !== null){
	  for (var i = 0; i < b.length; i++) {
	  Ext.create('widget.uxNotification', {
			title: 'Emergency '+b[i].data.NO_EMERGENCY+' !',
			position: 'br',
			manager: 'instructions',
			cls: 'ux-notification-light',
			// iconCls: 'ux-notification-icon-error',
			html: '<table border=0><tr><td rowspan=3><img src="resources/img/siren.gif" width=45 height=45/></td><td width=40>Regu </td><td>:</td><td> '+ b[i].data.REGUID+'</td></tr><tr><td>Tgl </td><td>:</td><td> '+ b[i].data.SEND_DATA+'</td></tr><tr><td>Pesan </td><td>:</td><td> '+ b[i].data.MESSAGE+'</td></tr>',
			autoCloseDelay: 60000,
			slideBackDuration: 500,
			slideInAnimation: 'bounceOut',
			slideBackAnimation: 'easeIn',
			width:350,
			listeners: {
							'beforerender': function(){
								// Sound.enable();
								// Sound.play('not.wav');
								// Sound.disable();
								var mySound = soundManager.createSound({
								 url: 'not.wav'
								});
								mySound.play({
  loops: 3
});
setTimeout(mySound.stop, 25000);
							}
						}
		}).show()
	  }}
	 }
	 }
});

	


})