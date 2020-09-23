Ext.define('MyDesktop.Track', {
    requires: []
});

var tabtrack = Ext.create('Ext.panel.Panel', {
    title: 'Tracking Regu',
    cls: 'inner-tab-custom',
    id: 'track',
    closeAction: 'destroy',
    layout: 'border',
    closable: true,
    hideMode: Ext.isIE ? 'offsets' : 'display',
    items: [{
        title: 'Daftar Regu',
        region: 'west',
        collapsible: true,
        width: 235,
        frame: true,
        minSize: 100,
        maxSize: 360,
        bodyStyle: 'padding:3px;',
        items:{	
		xtype : 'tabpanel',
		id	: 'details',
		items :
			[{
				xtype:'grid',
				id:'panelAll',
				height:290,
				title:'All()',
				store : dataTrackStoreAll,
				columns: [{
                    text: 'REGU',
                    width: 100,
					dataIndex: 'USERNAME'
                }, {
                    text: 'STATUS',
                    width: 100,
					dataIndex: 'STATUS'
                } ],	
				listeners: { 
					cellclick: function(gridView, htmlElement, columnIndex, dataRecord, a, b) {
						paramsId = dataRecord.data.USERNAME;
						Ext.getCmp('trackpanel').setTitle('Detail Regu : ' + paramsId)
						var mapregu = Ext.getCmp('trackmap').gmap;
						var dtlat = Number(dataRecord.data.LATITUDE);
						var dtlng = Number(dataRecord.data.LONGITUDE);
						var myLatLng = {lat: dtlat, lng: dtlng};			
						mapregu.setZoom(20);
						mapregu.setCenter(myLatLng);
					} // end function cellclick
				} // end listener
			},
			{
				xtype:'grid',
				id:'panelOff',
				height:290,
				title:'Off()',
				store : dataTrackStoreOff,
				columns: [{
                    text: 'REGU',
                    width: 100,
					dataIndex: 'USERNAME'
				}, {
                    text: 'NO IMEI',
                    width: 100,
					dataIndex: 'IMEI'
                }]
			},{
				xtype:'grid',
				id:'panelOn',
				height:290,
				title:'On()',
				store : dataTrackStoreOn,
				columns: [{
                    text: 'REGU',
                    width: 100,
					dataIndex: 'USERNAME'
				}, {
                    text: 'NO IMEI',
                    width: 100,
					dataIndex: 'IMEI'
                }]
			}]
		}
    }, 

/*---------------------------------------------------------*/
	
	
	
	
	
	
	
	
	
	
	{
        region: 'center',
        layout: 'fit',
		title: 'Detil Regu',
		id: 'trackpanel',
        items: [{
            xtype: 'panel',
            id: 'mybox_3',
            layout: 'fit',
            listeners: {
                'afterrender': function () {
                    this.setLoading(true)
                }
            },
            items: [{
                    xtype: 'gmappanel',
                    id: 'trackmap',
                    zoomLevel: 5,
                    setCenter: {
                        lat: -2.51515,
                        lng: 117.58667
                    },
                    listeners: {
                        'mapready': function (map) {
							var addListenersOnPolygon = function (polygon) {
                            var infoWindow = new google.maps.InfoWindow();

                            google.maps.event.addListener(polygon, 'click', function (event) {
                                var contentString = 'Area : ' + polygon.area + '<br/>Posko :' + polygon.title;
                                infoWindow.setContent(contentString);
                                infoWindow.setPosition(event.latLng);

                                infoWindow.open(map.gmap);

                            });
                            google.maps.event.addListener(polygon, 'mouseover', function () {
                                infoWindow.close();
                            });
                        }

                            var shapesAreaStore = Ext.create('Ext.data.Store', {
                                fields: ['warna', 'ckoor', 'koord','unit','unitid','area'],
                                proxy: {
                                    type: 'ajax',
                                    url: 'data/read.php',
                                    reader: {
                                        type: 'json',
                                        root: 'shapes',
                                    }
                                },
                                autoLoad: true,
                                listeners: {
                                    load: function () {
                                        var trackmap = Ext.getCmp('idmap');
                                        var arraypoly = [];
                                        var countries = new Array();
                                        if (posko_id == "") {
                                            var bounds = new google.maps.LatLngBounds();
                                        }
                                        for (var i = 0; i < shapesAreaStore.data.items.length; i++) {
                                            var arrc = [];
                                            if (posko_id != "") {
                                                var bounds = new google.maps.LatLngBounds();
                                            }
                                            for (var x = 0; x < shapesAreaStore.data.items[i].data.ckoor; x++) {

                                                arraypoly = 'new google.maps.LatLng' + shapesAreaStore.data.items[i].data.koord[0][x];
                                                bounds.extend(eval(arraypoly));
                                                arrc.push(eval(arraypoly));

                                            }

                                            countries.push(new google.maps.Polygon({
                                                fillColor: shapesAreaStore.data.items[i].data.warna,
                                                title: shapesAreaStore.data.items[i].data.unit,
                                                area: shapesAreaStore.data.items[i].data.area,
                                                unitid: shapesAreaStore.data.items[i].data.unitid,
                                                strokeColor: shapesAreaStore.data.items[i].data.warna,
                                                fillOpacity: 0.35,
                                                strokeOpacity: 0.8,
                                                strokeWeight: 2,
                                                paths: arrc,
                                                indexID: i
                                            }));
                                                
												map.gmap.fitBounds(bounds);
         

                                            countries[countries.length-1].setMap(map.gmap);
											addListenersOnPolygon(countries[i]);
                                        }
								


                                        google.maps.event.addDomListener(document.getElementById('area_cek'), 'click', function () {
                                            if (Ext.getCmp('area_cek').checked == false) {
                                                for (var i = 0, l = countries.length; i < l; i++) {
                                                    opt_enable = !countries[i].getMap();
                                                    countries[i].setMap(opt_enable ? map : null);
                                                }
                                            } else {
                                                for (var i = 0, l = countries.length; i < l; i++) {
                                                    countries[i].setMap(map.gmap);
                                                }
                                            }
                                        });
                                    }
                                }
                            });

                            var addListenersOnMarkersRegu = function (mark) {
                                var infoWindow = new google.maps.InfoWindow({
                                    maxWidth: 460,
                                    maxHeight: 500
                                });
                                google.maps.event.addListener(mark, 'click', function (event) {
                                    var contentString = '<iframe width="400" height="283px" src="info/infowindows.php?user=' + mark.user + '&unit=' + mark.unit + '&jml=' + mark.jml + '&lat=' + mark.lat + '&lng=' + mark.lng + '&status=' + mark.status + '&waktu=' + mark.waktu + '&userid=' + mark.userid + '" frameborder="0" />';
                                    infoWindow.setContent(contentString);
                                    infoWindow.setPosition(event.latLng);

                                    infoWindow.open(map.gmap);

                                });
                            }
	
                            var trackStore = Ext.create('Ext.data.Store', {
                                fields: ['USERID', 'DATE_TIME', 'LATITUDE', 'LONGITUDE', 'USERNAME', 'UNITNAME', 'STATUS', 'ICON', 'JML', 'USERID', 'DATE_TIME'],
                                proxy: {
                                    type: 'ajax',
                                    url: 'data/api/track.php',
                                    actionMethods: {
                                        read: 'POST'
                                    },
                                    reader: {
                                        type: 'json',
                                        root: 'ROW',
                                    }
                                },
                                autoLoad: true,
                                listeners: {
                                    'load': function (a, b) {
                                        var marker = [];

                                        for (var i = 0; i < b.length; i++) {
                                            marker[i] = new google.maps.Marker({
                                                position: new google.maps.LatLng(b[i].data.LATITUDE, b[i].data.LONGITUDE),
                                                icon: 'resources/img/' + b[i].data.ICON + '.png',
                                                map: map.gmap,
                                                user: b[i].data.USERNAME,
                                                userid: b[i].data.USERID,
                                                unit: b[i].data.UNITNAME,
                                                jml: b[i].data.JML,
                                                lat: b[i].data.LATITUDE,
                                                lng: b[i].data.LONGITUDE,
                                                status: b[i].data.STATUS,
                                                waktu: b[i].data.DATE_TIME
                                            });
                                            addListenersOnMarkersRegu(marker[i]);
                                        }

                                        google.maps.event.addDomListener(document.getElementById('regu_cek'), 'click', function () {
                                            if (Ext.getCmp('regu_cek').checked == false) {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(null);
                                                }
                                            } else {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(map.gmap);
                                                }
                                            }
                                        });

                                        function clockStart() {
                                            var trackinterval = setInterval(function () {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(null);
													marker[i]=[];
                                                }
                                                trackStore.load();
                                            }, 30000);
                                        }

                                        clockStart()
                                    }
                                }
                            });

                            var addListenersOnMarkersPadam= function (mark) {
                                var infoWindow = new google.maps.InfoWindow({
                                    maxWidth: 550,
                                    maxHeight: 510
                                });
                                google.maps.event.addListener(mark, 'click', function (event) {
                                    var contentString = '<iframe width="500px" height="400px" src="info/infotrack.php?idtiket=' + mark.idtiket + '&alamat=' + mark.alamat +
									'&status=' + mark.status + '&nama=' + mark.nama + '&telp=' + mark.telp + '&idpel=' + mark.idpel +
									'&cause=' + mark.cause +'&action=' + mark.action +'" frameborder="0" />';
                                    infoWindow.setContent(contentString);
                                    infoWindow.setPosition(event.latLng);

                                    infoWindow.open(map.gmap);

                                });
                            }

                            var padamStore = Ext.create('Ext.data.Store', {
                                fields: ['LATITUDE', 'LONGITUDE', 'LASTSTATUS', 'ID_TIKET', 'ALAMAT','PELAPOR','TELPPELAPOR','IDPEL','CAUSE','ACTION'],
                                proxy: {
                                    type: 'ajax',
                                    url: 'data/api/status.php?status=1',
                                    autoDestroy: false,
                                    actionMethods: {
                                        read: 'POST'
                                    },
                                    reader: {
                                        type: 'json',
                                        root: 'ROW',
                                    }
                                },
                                autoLoad: true,
                                listeners: {
                                    'load': function (a, b) 
                                    {
                                         // console.log(nyalaStore)
                                        var marker = [];

                                        var image = {
                                            url: 'resources/img/circle_red.png',
                                            size: new google.maps.Size(36, 36),
                                            origin: new google.maps.Point(0, 0),
                                            anchor: new google.maps.Point(0, 36)
                                        };

                                        for (var i = 0; i < b.length; i++) {
                                            marker[i] = new google.maps.Marker({
                                                position: new google.maps.LatLng(b[i].data.LATITUDE, b[i].data.LONGITUDE),
                                                map: map.gmap,
                                                icon: image,
                                                status: b[i].data.LASTSTATUS,
                                                idtiket: b[i].data.ID_TIKET,
                                                alamat: b[i].data.ALAMAT,
												nama: b[i].data.PELAPOR,
												telp: b[i].data.TELPPELAPOR,
												idpel: b[i].data.IDPEL,
												cause: b[i].data.CAUSE,
												action: b[i].data.ACTION,
                                            });
                                            addListenersOnMarkersPadam(marker[i]=marker);

                                        }

                                        google.maps.event.addDomListener(document.getElementById('padam_cek'), 'click', function () {
                                            if (Ext.getCmp('padam_cek').checked == false) {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(null);
                                                }
                                            } else {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(map);
                                                }
                                            }
                                        });

                                        function clockStart2() {
                                            var trackinterval = setInterval(function () {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(null);
                                                    marker[i]=[];
                                                }
                                                padamStore.load();
                                            }, 3000);
                                        }

                                        clockStart2()
                                    }
                                }
                            });

                            Ext.getCmp('mybox_3').setLoading(false);
                        }
                    }
                },
                Ext.create('Ext.Window', {
                    xtype: 'window',
                    closable: false,
                    minimizable: false,
                    title: 'Filter',
                    id: 'cw',
                    height: 140,
                    headerPosition: 'top',
                    width: 120,
                    padding: '0 5 0 5',
                    constrain: true,
                    resizable: false,
                    x: 80,
                    y: 10,
                    items: [{
                        xtype: 'checkbox',
                        hideEmptyLabel: true,
                        boxLabel: 'Area',
                        id: 'area_cek',
                        inputValue: 'area',
                        checked: true,
                    }, {
                        xtype: 'checkbox',
                        hideEmptyLabel: true,
                        boxLabel: 'Pel. Padam',
                        id: 'padam_cek',
                        inputValue: 'padam',
                        checked: true,
                    }, {
                        xtype: 'checkbox',
                        hideEmptyLabel: true,
                        boxLabel: 'Regu',
                        id: 'regu_cek',
                        inputValue: 'regu',
                        checked: true,
                    }]
                })
            ]
        }]
    },


	
	// var assetpadam = Ext.create('Ext.data.Store', {
 //                                fields: ['DISTRIBUSI', 'AREA', 'RAYON', 'LONGITUDE', 'LATITUDE','KODE_ASSET','COVERAGE','STATUS'],
 //                                proxy: {
 //                                    type: 'ajax',
 //                                    url: 'data/api/gardis_padam.php?status=1',
 //                                    autoDestroy: true,
 //                                    actionMethods: {
 //                                        read: 'POST'
 //                                    },
 //                                    reader: {
 //                                        type: 'json',
 //                                        root: 'ROW',
 //                                    }
 //                                },
 //                                autoLoad: true,
 //                                listeners: {
 //                                    'load': function (a, b) 
 //                                    {
 //                                         console.log(assetpadam)
 //                                        var marker = [];

 //                                        var image = {
 //                                            url: 'resources/img/circle_red.png',
 //                                            size: new google.maps.Size(36, 36),
 //                                            origin: new google.maps.Point(0, 0),
 //                                            anchor: new google.maps.Point(0, 36)
 //                                        };

 //                                        for (var i = 0; i < b.length; i++) {
 //                                            marker[i] = new google.maps.Marker({
 //                                                position: new google.maps.LatLng(b[i].data.LATITUDE, b[i].data.LONGITUDE),
 //                                                map: map.gmap,
 //                                                icon: image,
 //                                                area: b[i].data.AREA,
 //                                                unit: b[i].data.RAYON,
 //                                                Trafo: b[i].data.KODE_ASSET,
 //                                                wilayah: b[i].data.COVERAGE,
 //                                                status: b[i].data.STATUS,
                                                
 //                                            });
 //                                            addListenersOnMarkersNyala(marker[i]);

 //                                        }

	/*-------------------------------------------------------------*/
	        Ext.create('Ext.Window', {
            closable: true,
            minimizable: false,
            title: 'Detil Laporan',
            id: 'detlapis',
            closeAction: "hide",
            maximized: true,
            constrainHeader: true,
            layout: 'border',
            items: [{
                region: 'center',
                layout: 'fit',
                id: 'detailpanelis',
            }]
        })
		
		/*-------------------------------------------------------------*/
	
	
	
	
	
	],
    listeners: {
        beforeclose: function () {
            Ext.getCmp('cw').setVisible(false);
			Ext.getCmp('detlapis').hide();
        }
    }
});