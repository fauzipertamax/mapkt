Ext.define('MyDesktop.Track', {
    requires: []
});

// function startDataAll1() {
//     setInterval(function () {
//             dataTrackStoreAll.load();
//         }, 100000);

// };

function startDataAll2() {
    setInterval(function () {
            trackStore.load();
        }, 60000);

};

function startDataAll3() {
    setInterval(function () {
            ulcStore.load();
        }, 80000);

};

function startDataAll4() {
    setInterval(function () {
            nyalaStore.load();
        }, 80000);

};

function startDataAll5() {
    setInterval(function () {
            pelangganStore.load();
        }, 80000);

};

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
        width: 380,
        frame: true,
        minSize: 100,
        maxSize: 360,
        bodyStyle: 'padding:3px;',
        items: {	
		xtype : 'tabpanel',
		id	: 'details',
		items :
			[{
				xtype:'grid',
				id:'panelAll',
				height:450,
				title:'REGU All()',
				store : dataTrackStoreAll,
				columns: [{
                    text: 'AREA',
                    width: 100,
                    dataIndex: 'AREANAME'
                },{
                    text: 'POSKO',
                    width: 100,
                    dataIndex: 'UNITNAME'
                },{
                    text: 'REGU',
                    width: 100,
					dataIndex: 'USERNAME'
                }, {
                    text: 'STATUS',
                    width: 60,
					dataIndex: 'STATUS'
                    
                } ],	
				listeners: { 
                    // boxready: function(){
                    //     startDataAll1();
                    // },
					cellclick: function(gridView, htmlElement, columnIndex, dataRecord, a, b) {
						paramsId = dataRecord.data.USERNAME;
						Ext.getCmp('trackpanel').setTitle('Detail Regu : ' + paramsId)
						var mapregu = Ext.getCmp('trackmap').gmap;
						var dtlat = Number(dataRecord.data.LATITUDE);
						var dtlng = Number(dataRecord.data.LONGITUDE);
						var myLatLng = {lat: dtlat, lng: dtlng};			
						mapregu.setZoom(20);
						mapregu.setCenter(myLatLng);
                        var collapsible = Ext.getCmp('trackpanel').gmap;
                        collapsible.setCenter(myLatLng);
					} // end function cellclick
				}
                
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
                                    var contentString = '<iframe width="400" height="283px" src="info/infowindows2.php?user=' + mark.user + '&unit=' + mark.unit + '&jml=' + mark.jml + '&lat=' + mark.lat + '&lng=' + mark.lng + '&status=' + mark.status + '&waktu=' + mark.waktu + '&userid=' + mark.userid + '" frameborder="0" />';
                                    infoWindow.setContent(contentString);
                                    infoWindow.setPosition(event.latLng);

                                    infoWindow.open(map.gmap);

                                });
                            }
	
                            var trackStore = Ext.create('Ext.data.Store', {
                                fields: ['DATE_TIME', 'LATITUDE', 'LONGITUDE', 'USER_NAME', 'UNITNAME', 'STATUS', 'ICON', 'JML', 'USER_ID', 'DATE_TIME'],
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
                                    boxload: function(){
                                        startDataAll2();
                                    },
                                    'load': function (a, b) {
                                        console.log(b);
                                        var marker = [];

                                        for (var i = 0; i < b.length; i++) {
                                            marker[i] = new google.maps.Marker({
                                                position: new google.maps.LatLng(b[i].data.LATITUDE, b[i].data.LONGITUDE),
                                                icon: 'resources/img/' + b[i].data.ICON + '.png',
                                                map: map.gmap,
                                                user: b[i].data.USER_NAME,
                                                userid: b[i].data.USER_ID,
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
                                        //    function clockStart() {
                                        //    var trackinterval = setInterval(function () {
                                        //         for (var i = 0; i < b.length; i++) {
                                        //             marker[i].setMap(null);
                                        //             marker[i]=[];
                                        //         }
                                    
                                        //         trackStore.load();
                                        //     },60000);
                                        // }

                                        // clockStart()
                                     
                                    }
                                }
                            });

                          var addListenersOnMarkersAsset = function (mark) {

                                var infoWindow = new google.maps.InfoWindow({
                                    maxWidth: 450,
                                    maxHeight: 600
                                });
                                google.maps.event.addListener(mark, 'click', function (event) 
                                    { 
                                    var contentString = '<iframe width="350" height="250px" src="info/infoasset.php?dist=' + mark.dist + '&area=' + mark.area + '&rayon=' + mark.rayon + '&lat=' + mark.lat + 
                                    '&lng=' + mark.lng + '&status=' + mark.status + '&waktu=' + mark.waktu + '&kode_asset=' + mark.kode_asset + 
                                    '&cover=' + mark.cover + '&tiang=' + mark.tiang + '&jenis=' + mark.jenis +'" frameborder="0" />';
                                    infoWindow.setContent(contentString);
                                    infoWindow.setPosition(event.latLng);

                                    infoWindow.open(map.gmap);

                                });
                            }
    
                            var assetStore = Ext.create('Ext.data.Store', {
                                fields: ['DISTRIBUSI','AREA','RAYON', 'LATITUDE', 'LONGITUDE','STATUS','PADAM','KODE_ASSET','JENIS_ASSET','NO_TIANG','COVERAGE'],
                                proxy: {
                                    type: 'ajax',
                                    url: 'data/api/asset.php',
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
                                        console.log(a);
                                        var marker = [];

                                        var image = {
                                            url: 'image/map_marker.png',
                                            size: new google.maps.Size(36, 36),
                                            origin: new google.maps.Point(0, 0),
                                            anchor: new google.maps.Point(0, 36)
                                        };

                                            for (var i = 0; i < b.length; i++) {
                                            marker[i] = new google.maps.Marker({
                                                position: new google.maps.LatLng(b[i].data.LATITUDE, b[i].data.LONGITUDE),
                                                map: map.gmap,
                                                icon: image,
                                                dist: b[i].data.DISTRIBUSI,
                                                area: b[i].data.AREA,
                                                rayon: b[i].data.RAYON,
                                                kode_asset: b[i].data.KODE_ASSET,
                                                lat: b[i].data.LATITUDE,
                                                lng: b[i].data.LONGITUDE,
                                                status: b[i].data.STATUS,
                                                waktu: b[i].data.PADAM,
                                                jenis: b[i].data.JENIS_ASSET,
                                                cover: b[i].data.COVERAGE,
                                                tiang: b[i].data.NO_TIANG
                                            });
                                        
                                            addListenersOnMarkersAsset(marker[i]);
                                        }

                                        google.maps.event.addDomListener(document.getElementById('asset_cek'), 'click', function () {
                                            if (Ext.getCmp('asset_cek').checked == false) {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(null);
                                                }
                                            } else {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(map.gmap);
                                                }
                                            }
                                        });

                                        // function clockStart() {
                                        //     var trackinterval = setInterval(function () {
                                        //         for (var i = 0; i < b.length; i++) {
                                        //             marker[i].setMap(null);
                                        //             marker[i]=[];
                                        //         }
                                    
                                        //         assetStore.load();
                                        //     },440000);
                                        // }

                                        // clockStart()

                                     }
                                }
                            });
  

                          var addListenersOnMarkersUlc = function (mark) {

                                var infoWindow = new google.maps.InfoWindow({
                                    maxWidth: 460,
                                    maxHeight: 500
                                });
                                google.maps.event.addListener(mark, 'click', function (event) {
                                    var contentString = '<iframe width="400" height="283px" src="info/infoulc.php?user=' + mark.user + '&unit=' + mark.unit + '&jml=' + mark.jml + '&lat=' + mark.lat + '&lng=' + mark.lng + '&status=' + mark.status + '&waktu=' + mark.waktu + '&userid=' + mark.userid + '" frameborder="0" />';
                                    infoWindow.setContent(contentString);
                                    infoWindow.setPosition(event.latLng);

                                    infoWindow.open(map.gmap);

                                });
                            }
      
                          var ulcStore = Ext.create('Ext.data.Store', {
                                fields: ['DATE_TIME', 'LATITUDE', 'LONGITUDE', 'USER_NAME', 'UNITNAME', 'STATUS', 'ICON', 'JML', 'USER_ID', 'DATE_TIME'],
                                proxy: {
                                    type: 'ajax',
                                    url: 'data/api/ulc.php',
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
                                    'load': function(){
                                        startDataAll3();
                                    },
                                    'load': function (a, b) {
                                        // console.log(b);
                                        var marker = [];

                                        for (var i = 0; i < b.length; i++) {
                                            marker[i] = new google.maps.Marker({
                                                position: new google.maps.LatLng(b[i].data.LATITUDE, b[i].data.LONGITUDE),
                                                icon: 'image/' + b[i].data.ICON + '.png',
                                                map: map.gmap,
                                                user: b[i].data.USER_NAME,
                                                userid: b[i].data.USER_ID,
                                                unit: b[i].data.UNITNAME,
                                                jml: b[i].data.JML,
                                                lat: b[i].data.LATITUDE,
                                                lng: b[i].data.LONGITUDE,
                                                status: b[i].data.STATUS,
                                                waktu: b[i].data.DATE_TIME
                                            });
                                            addListenersOnMarkersUlc(marker[i]);
                                        }

                                        google.maps.event.addDomListener(document.getElementById('ulc_cek'), 'click', function () {
                                            if (Ext.getCmp('ulc_cek').checked == false) {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(null);
                                                }
                                            } else {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(map.gmap);
                                                }
                                            }
                                        });

                                        // function clockStart() {
                                        //     var trackinterval1 = setInterval(function () {
                                        //         for (var i = 0; i < b.length; i++) {
                                        //             marker[i].setMap(null);
                                        //             marker[i]=[];
                                        //         }
                                        //         ulcStore.load();
                                        //     }, 60000);
                                        // }



                                        // clockStart();                                        


                                    }
                                }
                            });                

                            var addListenersOnMarkersNyala = function (mark) {
                                var infoWindow = new google.maps.InfoWindow({
                                    maxWidth: 550,
                                    maxHeight: 510
                                });
                                google.maps.event.addListener(mark, 'click', function (event) {
                                    var contentString = '<iframe width="500px" height="500px" src="info/infotrack.php?idtiket=' + mark.idtiket + '&alamat=' + mark.alamat +
									'&status=' + mark.status + '&nama=' + mark.nama + '&telp=' + mark.telp + '&idpel=' + mark.idpel +
									'&cause=' + mark.cause +'&action=' + mark.action +'" frameborder="0" />';
                                    infoWindow.setContent(contentString);
                                    infoWindow.setPosition(event.latLng);

                                    infoWindow.open(map.gmap);

                                });
                            }

                            var nyalaStore = Ext.create('Ext.data.Store', {
                                fields: ['LATITUDE', 'LONGITUDE', 'LASTSTATUS', 'ID_TIKET', 'ALAMATPELAPOR','NAMAPELAPOR','TELPPELAPOR','IDPEL','CAUSE','ACTION'],
                                proxy: {
                                    type: 'ajax',
                                    url: 'data/api/status.php?status=1',
                                    autoDestroy: true,
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
                                        console.log(a);
                                        var marker = [];

                                        var image = {
                                            url: 'image/rumah.png',
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
                                                alamat: b[i].data.ALAMATPELAPOR,
												nama: b[i].data.NAMAPELAPOR,
												telp: b[i].data.TELPPELAPOR,
												idpel: b[i].data.IDPEL,
												cause: b[i].data.CAUSE,
												action: b[i].data.ACTION,
                                            });
                                            addListenersOnMarkersNyala(marker[i]);

                                        }

                                        google.maps.event.addDomListener(document.getElementById('nyala_cek'), 'click', function () {
                                            if (Ext.getCmp('nyala_cek').checked == false) {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(null);
                                                }
                                            } else {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(map.gmap);
                                                }
                                            }
                                        });

         //                                // function clockStart2() {
         //                                //     var trackinterval = setInterval(function () {
         //                                //         for (var i = 0; i < b.length; i++) {
         //                                //             marker[i].setMap(null);
         //                                //             marker[i]=[];
         //                                //         }
         //                                //         nyalaStore.load();
         //                                //     }, 3000);
         //                                // }

         //                                // clockStart2()
                                    }
                                }
                            });
                            
                            var addListenersOnMarkersPelanggan = function (mark) {

                                var infoWindow = new google.maps.InfoWindow({
                                    maxWidth: 450,
                                    maxHeight: 600
                                });
                                google.maps.event.addListener(mark, 'click', function (event) 
                                    { 
                                    var contentString = '<iframe width="350" height="250px" src="info/historypelanggan.php?dist=' + mark.dist + '&area=' + mark.area + '&rayon=' + mark.rayon + '&lat=' + mark.lat + 
                                    '&lng=' + mark.lng + '&status=' + mark.status + '&waktu=' + mark.waktu + '&customername=' + mark.customername + 
                                    '&customernumber=' + mark.customernumber + '&address=' + mark.address + '" frameborder="0" />';
                                    infoWindow.setContent(contentString);
                                    infoWindow.setPosition(event.latLng);

                                    infoWindow.open(map.gmap);

                                });
                            }
    
                            var pelangganStore = Ext.create('Ext.data.Store', {
                                fields: ['DISTRIBUSI','AREA','RAYON', 'KOORDINAT_X', 'KOORDINAT_Y','STATUS','PADAM','CUSTOMERNAME','CUSTOMERNUMBER','ADDRESS'],
                                proxy: {
                                    type: 'ajax',
                                    url: 'data/api/pelanggan.php',
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
                                        console.log(a);
                                        var marker = [];

                                        var image = {
                                            url: 'image/map_marker2.png',
                                            size: new google.maps.Size(36, 36),
                                            origin: new google.maps.Point(0, 0),
                                            anchor: new google.maps.Point(0, 36)
                                        };

                                            for (var i = 0; i < b.length; i++) {
                                            marker[i] = new google.maps.Marker({
                                                position: new google.maps.LatLng(b[i].data.KOORDINAT_X, b[i].data.KOORDINAT_Y),
                                                map: map.gmap,
                                                icon: image,
                                                dist: b[i].data.DISTRIBUSI,
                                                area: b[i].data.AREA,
                                                rayon: b[i].data.RAYON,
                                                lat: b[i].data.KOORDINAT_X,
                                                lng: b[i].data.KOORDINAT_Y,
                                                status: b[i].data.STATUS,
                                                waktu: b[i].data.PADAM,
                                                customername: b[i].data.CUSTOMERNAME,
                                                customernumber: b[i].data.CUSTOMERNUMBER,
                                                address: b[i].data.ADDRESS
                                                
                                            });
                                        
                                            addListenersOnMarkersPelanggan(marker[i]);
                                        }

                                        google.maps.event.addDomListener(document.getElementById('padam_cek'), 'click', function () {
                                            if (Ext.getCmp('padam_cek').checked == false) {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(null);
                                                }
                                            } else {
                                                for (var i = 0; i < b.length; i++) {
                                                    marker[i].setMap(map.gmap);
                                                }
                                            }
                                        });

                            //             // function clockStart4() {
                            //             //     var trackinterval = setInterval(function () {
                            //             //         for (var i = 0; i < b.length; i++) {
                            //             //             marker[i].setMap(null);
                            //             //             marker[i]=[];
                            //             //         }
                            //             //         assetStore.load();
                            //             //     }, 30000);
                            //             // }

                            //             // clockStart4()
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
                    height: 200,
                    headerPosition: 'top',
                    width: 150,
                    padding: '0 5 0 5',
                    constrain: true,
                    resizable: false,
                    initCenter: false,
                    // mywindow.setPosition(100,100);
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
                        boxLabel: 'Pelanggan Padam',
                        id: 'nyala_cek',
                        inputValue: 'nyala',
                        checked: true,
                    },{
                        xtype: 'checkbox',
                        hideEmptyLabel: true,
                        boxLabel: 'Regu Motor',
                        id: 'ulc_cek',
                        inputValue: 'ulc',
                        checked: true,
                    }, {
                        xtype: 'checkbox',
                        hideEmptyLabel: true,
                        boxLabel: 'Regu Mobil',
                        id: 'regu_cek',
                        inputValue: 'regu',
                        checked: true,
                    }, {
                        xtype: 'checkbox',
                        hideEmptyLabel: true,
                        boxLabel: 'Dampak Padam',
                        id: 'padam_cek',
                        inputValue: 'padam',
                        checked: true,
                    },{
                        xtype: 'checkbox',
                        hideEmptyLabel: true,
                        boxLabel: 'Asset Padam',
                        id: 'asset_cek',
                        inputValue: 'Asset_Padam',
                        checked: true,
                    }]
                })
            ]
        }]
    },
	
	
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