Ext.define('MyDesktop.Draw', {
    requires: []
});

var tabdraw = Ext.create('Ext.panel.Panel', {
    title: 'Draw Area',
    cls: 'inner-tab-custom',
    id: 'draw',
    closeAction: 'destroy',
    layout: 'border',
    closable: true,
    hideMode: Ext.isIE ? 'offsets' : 'display',
    items: [{
        title: 'Filter',
        region: 'west',
        collapsible: true,
        width: 235,
        frame: true,
        minSize: 100,
        maxSize: 360,
        bodyStyle: 'padding:3px;',
        items: {
            xtype: 'form',
            id: "area_pnl",
            frame: false,
            height: 350,
            minHeight: 350,
            bodyPadding: '2 2 2 2',
            items: [{
                xtype: 'fieldset',
                title: 'Unit',
                items: [{
                    xtype: 'combobox',
                    id: 'cmb_distribusi',
                    nama: 'dist',
                    displayField: 'UNITNAME',
                    valueField: 'UNITID',
                    emptyText: 'pilih distribusi',
                    store: dist,
                    anchor: '100%',
                    editable: false,
                    queryMode: 'local',
                    listeners: {
                        'beforerender': function () {
                            this.store.load({
                                scope: this,
                                callback: function () {
                                    Ext.getCmp('area_pnl').setLoading(false)
                                }
                            });
                            this.setValue(distribusi_id);
                            cbg = Ext.getCmp('cmb_cabang');
                            psk = Ext.getCmp('cmb_posko');
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
                            } else {
                                this.setReadOnly(true);
                                cbg.setReadOnly(false);
                                psk.setReadOnly(false);
                                psk.disable()
                            }
                        },
                        'select': function (cmb, data, idx) {
                            cbg = Ext.getCmp('cmb_cabang');
                            psk = Ext.getCmp('cmb_posko');
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
                }, {
                    xtype: 'combobox',
                    id: 'cmb_cabang',
                    displayField: 'UNITNAME',
                    nama: 'area',
                    valueField: 'UNITID',
                    emptyText: 'pilih area',
                    margins: '0 0 0 6',
                    anchor: '100%',
                    store: cabang,
                    queryMode: 'local',
                    editable: false,
                    listeners: {
                        'select': function (cmb, data, idx) {
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
                    id: 'cmb_posko',
                    displayField: 'UNITNAME',
                    nama: 'rayon',
                    valueField: 'UNITID',
                    emptyText: 'pilih unit',
                    anchor: '100%',
                    margins: '0 0 0 6',
                    queryMode: 'local',
                    store: posko,
                    editable: false,
                    'beforerender': function () {
                        this.store.load()
                    },
                }]
            }, {
                xtype: 'fieldset',
                title: 'Warna Area',
                items: [new Ext.create('Ext.picker.Color', {
                    id: 'cp'
                })]
            }, {
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    padding: '5',
                    align: 'left'
                },
                defaults: {
                    margin: '0 15 0 0'
                },
                items: [{
                    xtype: 'button',
                    text: 'Reset',
                    id: 'deletetemp-button',
                    handler: function () {
                        Ext.getCmp('cp').clear();
                        Ext.getCmp('save-button').disable();
                    }
                }, {
                    xtype: 'button',
                    text: 'Hapus',
                    disabled: true,
                    id: 'delete-button',
                    handler: function () {
                        Ext.getCmp('cp').clear();
                        Ext.getCmp('save-button').disable();
                    }
                }, {
                    xtype: 'button',
                    text: 'Simpan',
                    id: 'save-button',
                    disabled: false,
                    handler: function () {

                    }
                }]
            }],
            listeners: {
                'afterrender': function () {
                    this.setLoading(true)
                }
            }
        }
    }, {
        region: 'center',
        layout: 'fit',
        id: 'drawpanel',
        items: [{
            xtype: 'panel',
            id: 'mybox_2',
            layout: 'fit',
            listeners: {
                'afterrender': function () {
                    this.setLoading(true)
                }
            },
            items: [{
                xtype: 'gmappanel',
                id: 'newmap',
                zoomLevel: 5,
                setCenter: {
                    lat: -2.51515,
                    lng: 117.58667
                },
                listeners: {
                    'mapready': function (map) {

                        maps = map;

                        var selectedShape;

                        function clearSelection() {
                            if (selectedShape) {
                                selectedShape.setEditable(false);
                                selectedShape = null;
                            }
                        }

                        function setSelection(shape) {
                            clearSelection();
                            selectedShape = shape;
                            shape.setEditable(true);

                        }

                        function deleteSelectedShape() {
                            if (selectedShape) {
                                Ext.MessageBox.confirm('Konfirmasi', 'Apakah anda yakin akan menghapus area ini?', function (buttonText) {
                                    if (buttonText == "yes") {
                                        Ext.Ajax.request({
                                            url: 'data/delete.php',
                                            success: function (a) {
                                                if (a.responseText == "true") {
                                                    Ext.Msg.alert('Perhatian', 'Proses hapus berhasil !')
                                                    Ext.getCmp('cp').clear();
                                                    selectedShape.setMap(null);
                                                    selectedShape = null;
                                                } else {
                                                    Ext.Msg.alert('Peringatan', 'Proses hapus gagal !')
                                                }
                                            },
                                            params: {
                                                posko: selectedShape.unitid,
                                            },
                                        });
                                    }
                                });
                            }
                        }

                                
                                var coordinates=new Array();


                        function simpanSelectedShape() {
                              
                            if (selectedShape) {
                                var polygonBounds = selectedShape.getPath();
                                for(var i = 0 ; i < polygonBounds.length ; i++)
                                {
                                    coordinates.push('('+polygonBounds.getAt(i).lat(), polygonBounds.getAt(i).lng()+')');
                                } 
                                if (Ext.getCmp('cmb_posko').getValue() != null) {
                                    Ext.Ajax.request({
                                        url: 'data/api/insert.php',
                                        success: function (a) {
                                            console.log(a.responseText);
                                            if (a.responseText == true) {
                                                Ext.Msg.alert('Perhatian', 'Proses simpan berhasil !')
                                                Ext.getCmp('cp').clear();
                                                Ext.getCmp('save-button').enable();
                                                selectedShape.setMap(null);
                                                selectedShape = null;
                                                shapesStore.load();
                                            } else {
                                                Ext.Msg.alert('Peringatan', 'Proses simpan gagal !')
                                            }
                                        },
                                        params: {
                                            distribusi: Ext.getCmp('cmb_distribusi').getValue(),
                                            area: Ext.getCmp('cmb_cabang').getValue(),
                                            posko: Ext.getCmp('cmb_posko').getValue(),
                                            type: selectedShape.type,
                                            warna: selectedShape.fillColor,
                                            koordinat: [coordinates]
                                        },
                                    });
                                } else {
                                    Ext.Msg.alert('Peringatan', 'Posko tidak ada, Proses simpan gagal !')
                                }
                            } else {
                                Ext.Msg.alert('Peringatan', 'Tidak ada shape, Proses simpan gagal !')
                            }
                        }

                        function rgb2hex(rgb) {
                            var hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
                            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

                            function hex(x) {
                                return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
                            }
                            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
                        }
                        google.maps.event.addDomListener(document.getElementById('deletetemp-button'), 'click', function () {
                            shapesStore.load();
                        });


                        var addListenersOnPolygon = function (polygon) {
                            var infoWindow = new google.maps.InfoWindow();
                            if (polygon.unitid == posko_id) {
                                google.maps.event.addListener(polygon, 'click', function (event) {
                                    setSelection(polygon)
                                });
                            }
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


                        var shapesStore = Ext.create('Ext.data.Store', {
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
                                load: function () {
                                    var arraypoly = [];
                                    var countries = new Array();
                                    if (posko_id == "") {
                                        var bounds = new google.maps.LatLngBounds();
                                    }
                                    for (var i = 0; i < shapesStore.data.items.length; i++) {
                                        var arrc = [];
                                        if (posko_id != "") {
                                            var bounds = new google.maps.LatLngBounds();
                                        }
                                        for (var x = 0; x < shapesStore.data.items[i].data.ckoor; x++) {
                                            arraypoly = 'new google.maps.LatLng' + shapesStore.data.items[i].data.koord[0][x];
                                            bounds.extend(eval(arraypoly));
                                            arrc.push(eval(arraypoly));

                                        }

                                        countries[i] = new google.maps.Polygon({
                                            fillColor: shapesStore.data.items[i].data.warna,
                                            title: shapesStore.data.items[i].data.unit,
                                            area: shapesStore.data.items[i].data.area,
                                            unitid: shapesStore.data.items[i].data.unitid,
                                            fillOpacity: 0.45,
                                            strokeOpacity: 0.8,
                                            strokeWeight: 0,
                                            paths: arrc,
                                            indexID: i
                                        })
                                    }

                                    if (countries.length != 0) {
                                        map.gmap.fitBounds(bounds);
                                    }

                                    for (var i = 0; i < countries.length; i++) {
                                        countries[i].setMap(null);
                                        countries[i].setMap(map.gmap);
                                        addListenersOnPolygon(countries[i]);
                                        if (countries[i].unitid == posko_id) {
                                            setSelection(countries[i]);
                                            Ext.getCmp('delete-button').enable();
                                            break;
                                        }
                                    }


                                    google.maps.event.addDomListener(document.getElementById('deletetemp-button'), 'click', function () {
                                        if (selectedShape) {
                                            selectedShape.setMap(null);
                                            clearSelection();
                                        } else {
                                            for (var i = 0, l = countries.length; i < l; i++) {
                                                opt_enable = !countries[i].getMap();
                                                countries[i].setMap(opt_enable ? map : null);
                                            }
                                        }
                                    });

                                    
									Ext.getCmp('mybox_2').setLoading(false)
                                }
                            }
                        });

                        var polyOptions = {
                            strokeWeight: 0,
                            fillOpacity: 0.45,
                            strokeOpacity: 0.8,
                        };

                        google.maps.event.addDomListener(document.getElementById('cp'), 'click', function (a) {
                            var colour = a.target.style.background
                            var warna = rgb2hex(colour)
                            var polygonOptions = drawingManager.get('polygonOptions');
                            polygonOptions.fillColor = warna;
                            drawingManager.set('polygonOptions', polygonOptions);
                        })

                        var drawingManager = new google.maps.drawing.DrawingManager({
                            drawingControl: false,
                            drawingControlOptions: {
                                position: google.maps.ControlPosition.TOP_RIGHT,
                                drawingModes: [
                                    google.maps.drawing.OverlayType.POLYGON,
                                ]
                            },
                            polygonOptions: polyOptions
                        });

                        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {

                            if (e.type != google.maps.drawing.OverlayType.MARKER) {
                                drawingManager.setDrawingMode(null);
                                var newShape = e.overlay;
                                newShape.type = e.type;
                                google.maps.event.addListener(newShape, 'click', function (a) {
                                    setSelection(newShape);
                                });
                                setSelection(newShape);
                            }
                        });

                        google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
						if(Ext.getCmp('save-button').disabled==false){
                        google.maps.event.addDomListener(document.getElementById('save-button'), 'click', simpanSelectedShape);
						}
                        google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);
                        google.maps.event.addDomListener(document.getElementById('cp'), 'click', function (a) {
                            var colour = a.target.style.background
                            var warna = rgb2hex(colour)
                            if (!selectedShape) {
                                drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
                                Ext.getCmp('save-button').enable();
                                console.log('save-button');
                            } else {
                                if (selectedShape) {
                                    selectedShape.set('fillColor', warna);
                                    Ext.getCmp('save-button').enable();
                                }
                            }
                        });

                        drawingManager.setMap(maps.gmap);
                    }
                }
            }]
        }]
    }]
});