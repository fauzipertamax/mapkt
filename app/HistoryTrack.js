Ext.define('MyDesktop.HistoryTrack', {
    requires: []
});

var check = null;

        function startData() {
            if (check == null) {
                check = setInterval(function () {
                    dataStore.load();
                }, 30000);
            }
        };
        function stopData() {
            clearInterval(check);
            check = null;
        };
var markerx;
var linex;

var reguKoordData = Ext.create('Ext.data.Store', {
    fields: ['ID_TIKET', 'DATE_TIME', 'LATITUDE', 'LONGITUDE', 'USER_ID', 'UNIT_ID', 'USER_NAME'],
    proxy: {
        type: 'ajax',
        url: 'data/api/koordinatregu.php',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'ROW',
        }
    },
    listeners: {
        load: function(a, b) {
			Ext.getCmp('griddatakoord').setLoading(false);
            map = Ext.getCmp('newmap_histtrack').gmap;

            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 4
            };

            var myLatlng = new google.maps.LatLng(b[0].data.LATITUDE, b[0].data.LONGITUDE);

            var addListenersOnMarkersReguz = function(mark) {
                var infoWindow = new google.maps.InfoWindow({
                    width: 175,
                    height: 115
                });
                google.maps.event.addListener(mark, 'click', function(event) {
                    var contentString = 'No Lapor : ' + mark.id_tiket;
                    infoWindow.setContent(contentString);
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);

                });
            }


            var lineArr = [];
            for (var i = 0; i < b.length; i++) {
                point = new google.maps.LatLng(b[i].data.LATITUDE, b[i].data.LONGITUDE);
                lineArr.push(point);
            }

            linex = new google.maps.Polyline({
                path: lineArr,
                strokeOpacity: 0,
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '20px'
                }],
                map: map
            });

            markerx = new google.maps.Marker({
                position: myLatlng,
                icon: 'resources/img/greenm.png',
                map: map
            });

            map.setCenter(myLatlng);


        }
    }
});

var cabang1 = Ext.create('Ext.data.Store', {
    fields: ['UNITID', 'UNITNAME'],
    proxy: {
        type: 'ajax',
        url: 'data/api/cabang1.php',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'ROW'
        }
    },
    autoLoad:false
});

// var poskoCombo = Ext.create('Ext.data.Store', {
//     fields: ['UNITID', 'UNITNAME'],
//     proxy: {
//         type: 'ajax',
//         url: 'data/api/posko1.php',
//         actionMethods: {
//             read: 'POST'
//         },
//         reader: {
//             type: 'json',
//             root: 'ROW'
//         }
//     }
// });



var tabhistory = Ext.create('Ext.panel.Panel', {
    title: 'Regu History Track',
    cls: 'inner-tab-custom',
    id: 'historytrack',
    closeAction: 'destroy',
    layout: 'border',
    closable: true,
    hideMode: Ext.isIE ? 'offsets' : 'display',
    items: [{
        title: 'Regu History Track',
        region: 'west',
        collapsible: true,
        width: 350,
        frame: true,
        minSize: 100,
        maxSize: 360,
        xtype: 'grid',
        layout: 'fit',
        id: 'griddatakoord',
        store: reguKoordData,
		viewConfig:{
			loadMask:false
		},
        tbar: [{
            xtype: 'form',
            id: "histotrack_pnl",
            width: '100%',
            frame: false,
            bodyPadding: '2 2 2 2',
            items: [{
                xtype: 'fieldset',
                title: 'Filter Regu',
                items: [ {
                    xtype: 'datefield',
                    maxValue: new Date(),
                    allowBlank: false,
                    name: 'tglregu',
                    id: 'tglregu',
                    anchor: '100%',
                    format: 'd/m/Y',
                    listeners: {
                        'change': function() {
                            // rg = Ext.getCmp('cmb_regu');
                            if (rg.disabled == true) {
                                rg.enable();
                            } else {
                                rg.setValue('');
                            }
                        }
                    }
                },{
                        xtype: 'combobox',
                        id: 'cmb_griddistribusi',
                        nama: 'dist',
                        displayField: 'UNITNAME',
                        valueField: 'UNITID',
                        emptyText: 'pilih distribusi',
                        store: dist,
                        anchor: '100%',
                        editable: false,
                        allowBlank: true,
                        queryMode: 'local',
                        listeners: {
                            'beforerender': function() {
                                this.store.load({
                                    scope: this,
                                    callback: function() {
                                        Ext.getCmp('gridarea_pnl').setLoading(false)
                                    }
                                });
                                this.setValue(distribusi_id);
                                cbg = Ext.getCmp('cmb_gridcabang');
                                psk = Ext.getCmp('cmb_gridposko');
                                cbg.store.load({
                                    params: {
                                        'uid': distribusi_id
                                    }
                                });
                                cbg.setValue(area_id);
                                psk.store.load({
                                    params: {
                                        'cid': area_id
                                    }
                                });
                                psk.setValue(posko_id);
                                if (unittypeid == 5) {
                                    this.setReadOnly(true);
                                    cbg.setReadOnly(true);
                                    psk.setReadOnly(true);
                                } else if (unittypeid == 4 || unittypeid == 3) {
                                    this.setReadOnly(true);
                                    cbg.setReadOnly(true);
                                    psk.setReadOnly(false);
                                    psk.enable();
                                } else if(unittypeid == 2){
                                   this.setReadOnly(false);
                                    cbg.setReadOnly(false);
                                    psk.setReadOnly(false);
                                    psk.enable();
                                }else{
                                    this.setReadOnly(true);
                                    cbg.setReadOnly(false);
                                    psk.setReadOnly(false);
                                    psk.disable()
                                }
                            },
                            'select': function(cmb, data, idx) {
                                cbg = Ext.getCmp('cmb_gridcabang');
                                psk = Ext.getCmp('cmb_gridposko');
                                psk.clearValue();
                                cbg.clearValue();
                                cbg.store.load({
                                    params: {
                                        'uid': this.value
                                    }
                                });
                                cbg.enable();
                            }
                        }
                    },{
                        xtype: 'combobox',
                        id: 'cmb_gridcabang',
                        displayField: 'UNITNAME',
                        nama: 'area',
                        valueField: 'UNITID',
                        emptyText: 'pilih area',
                        margins: '0 0 0 6',
                        anchor: '100%',
                        store: cabang,
                        queryMode: 'local',
                        allowBlank: true,
                        editable: false,
                        listeners: {
                            'select': function(cmb, data, idx) {
                                psk = Ext.getCmp('cmb_posko');
                                psk.clearValue();
                                psk.store.load({
                                    params: {
                                        'cid': this.value
                                    }
                                });
                                psk.enable();
                            }
                        }
                    }, {
                        xtype: 'combobox',
                        id: 'cmb_histgridposko',
                        displayField: 'UNITNAME',
                        nama: 'rayon',
                        valueField: 'UNITID',
                        emptyText: 'pilih unit',
                        anchor: '100%',
                        margins: '0 0 0 6',
                        queryMode: 'local',
                        store: posko,
                        allowBlank: true,
                        editable: false,
                        'beforerender': function() {
                            this.store.load()
                        },
                        listeners: {
                            'select': function(cmb, data, idx) {
                                  psk = Ext.getCmp('cmb_regu');
                                psk.clearValue();
                                psk.store.load({
                                    params: {
                                        'regu': this.value
                                    }
                                });
                                psk.enable();
                            }
                        }      
                    }, {
                    xtype: 'combo',
                    id: 'cmb_regu',
                    nama: 'regu',
                    displayField: 'REGUNAME',
                    valueField: 'REGUID',
                    emptyText: 'pilih regu',
                    store: reguKoord,
                    anchor: '100%',
                    editable: false,
                    queryMode: 'local',
                    // disabled: true,
                        'beforerender': function() {
                            this.store.load()
                        },
                    listConfig: {

                        // Custom rendering template for each item
                        getInnerTpl: function() {
                            return '<b>{REGUNAME}</b> - <font color="grey">{UNITNAME}</font>';
                        }
                    },
                    listeners: {
                        'select': function(a, b) {
							Ext.getCmp('griddatakoord').setLoading(true);
                            tgl = Ext.getCmp('tglregu').getValue();
                            var awal = Ext.util.Format.date(tgl, 'd/m/Y');
                            regu = this.value;
                            gridStore = Ext.getCmp('griddatakoord').getStore();
                            gridStore.load({
                                params: {
                                    tgl: awal,
                                    regu: regu
                                }
                            });
                            map = Ext.getCmp('newmap_histtrack').gmap;
                            map.setZoom(12);
                            if (linex) {
                                linex.setMap(null);
                            }
                            if (markerx) {
                                markerx.setMap(null);
                            }
                        }
                    }
                }]
            }]
        }],
        columns: [{
            text: 'Jam',
            dataIndex: 'DATE_TIME',
            flex: 1,
            sortable: false
        }, {
            text: "Koordinat",
            sortable: false,
            columns: [{
                text: "Longitude",
                dataIndex: 'LONGITUDE',
                width: 125,
                sortable: false
            }, {
                text: "Latitude",
                dataIndex: 'LATITUDE',
                width: 125,
                sortable: false
            }]
        }],
        listeners: {
            cellclick: function(gridView, htmlElement, columnIndex, dataRecord, a, b) {

                map = Ext.getCmp('newmap_histtrack').gmap;

                var myLatlng = new google.maps.LatLng(dataRecord.data.LATITUDE, dataRecord.data.LONGITUDE);

                markerx.setPosition(myLatlng);

                map.setZoom(15);
                map.setCenter(myLatlng);

                // var marker = new google.maps.Marker({
                // position: myLatlng,
                // map: map
                // });

            }
        }
    }, {
        region: 'center',
        layout: 'fit',
        id: 'historytrackpanel',
        items: [{
            xtype: 'panel',
            id: 'mybox_2track',
            layout: 'fit',
            listeners: {
                'afterrender': function() {
                    this.setLoading(true)
                }
            },
            items: [{
                xtype: 'gmappanel',
                id: 'newmap_histtrack',
                zoomLevel: 5,
                setCenter: {
                    lat: -2.51515,
                    lng: 117.58667
                },
                listeners: {
                    'mapready': function(map) {

                        var addListenersOnPolygon = function(polygon) {
                            var infoWindow = new google.maps.InfoWindow();

                            google.maps.event.addListener(polygon, 'click', function(event) {
                                var contentString = 'Area : ' + polygon.area + '<br/>Posko :' + polygon.title;
                                infoWindow.setContent(contentString);
                                infoWindow.setPosition(event.latLng);

                                infoWindow.open(map.gmap);

                            });
                            google.maps.event.addListener(polygon, 'mouseover', function() {
                                infoWindow.close();
                            });
                        }

                        var shapesAreaStore = Ext.create('Ext.data.Store', {
                            fields: ['warna', 'ckoor', 'koord', 'unit', 'unitid', 'area'],
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
                                load: function() {
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


                                        countries[countries.length - 1].setMap(map.gmap);
                                        addListenersOnPolygon(countries[i]);
                                    }
                                    Ext.getCmp('mybox_2track').setLoading(false)
                                }
                            }
                        });
                        userGrid = Ext.getCmp('griddatakoord');


                    }
                }
            }]
        }]
    }]
});