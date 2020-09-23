Ext.define('MyDesktop.Grid', {
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


var tabgrid = Ext.create('Ext.panel.Panel', {
    title: 'Tranksaksi Aktif',
    cls: 'inner-tab-custom',
    id: 'grid',
    closeAction: 'destroy',
    layout: 'border',
    closable: true,
    hideMode: Ext.isIE ? 'offsets' : 'display',
    layout: 'border',
    items: [{
            title: 'Filter',
            region: 'west',
            collapsible: true,
            width: 250,
            frame: false,
            minSize: 100,
            maxSize: 350,
            bodyStyle: 'padding:3px;',
            split: true,
            items: [{
                xtype: 'form',
                id: "gridarea_pnl",
                frame: false,
                bodyPadding: '2 2 2 2',
                items: [{
                    xtype: 'fieldset',
                    title: 'Periode',
                    items: [{
                        xtype: 'datefield',
                        name: 'startdt',
                        itemId: 'startdt',
                        id: 'awal',
                        endDateField: 'enddt', // id of the end date field
                        emptyText: 'pilih tanggal awal',
                        format: 'd/m/Y',
                        anchor: '100%',
                        maxValue: new Date(),
                        value: new Date(),
                        listeners: {
                            daterange: function(val, field) {
                                var date = field.parseDate(val);
                                if (!date) {
                                    return false;
                                }
                                if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                                    var start = field.up('form').down('#' + field.startDateField);
                                    start.setMaxValue(date);
                                    start.validate();
                                    this.dateRangeMax = date;
                                } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                                    var end = field.up('form').down('#' + field.endDateField);
                                    end.setMinValue(date);
                                    end.validate();
                                    this.dateRangeMin = date;
                                }
                                return true;
                            },
                            daterangeText: 'Start date must be less than end date',
                        }
                    }, {
                        xtype: 'datefield',
                        name: 'enddt',
                        itemId: 'enddt',
                        id: 'akhir',
                        startDateField: 'startdt', // id of the start date field
                        emptyText: 'pilih tanggal akhir',
                        format: 'd/m/Y',
                        anchor: '100%',
                        maxValue: new Date(),
                        value: new Date()
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Unit',
                    items: [{
                        xtype: 'combobox',
                        id: 'cmb_griddistribusi',
                        nama: 'dist',
                        displayField: 'UNAME',
                        valueField: 'UID',
                        emptyText: 'pilih distribusi',
                        store: dist,
                        anchor: '100%',
                        editable: false,
						allowBlank: false,
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
                    }, {
                        xtype: 'combobox',
                        id: 'cmb_gridcabang',
                        displayField: 'CNAME',
                        nama: 'area',
                        valueField: 'CID',
                        emptyText: 'pilih area',
                        margins: '0 0 0 6',
                        anchor: '100%',
                        store: cabang,
                        queryMode: 'local',
						allowBlank: false,
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
                        id: 'cmb_gridposko',
                        displayField: 'RNAME',
                        nama: 'rayon',
                        valueField: 'RID',
                        emptyText: 'pilih unit',
                        anchor: '100%',
                        margins: '0 0 0 6',
                        queryMode: 'local',
                        store: posko,
						allowBlank: false,
                        editable: false,
                        'beforerender': function() {
                            this.store.load()
                        },
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Pencarian',
                    items: [{
                        xtype: 'combobox',
                        emptyText: 'pilih jenis pencarian',
                        store: jenis,
                        id: 'jenisk',
                        valueField: 'jns',
                        displayField: 'jname',
                        anchor: '100%',
                        allowBlank: true,
                        editable: false,
                        listeners: {
                            'select': function() {
                                if (this.value) {
                                    Ext.getCmp('searchk').allowBlank = false;
                                }
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        emptyText: 'cari',
                        id: 'searchk',
                        margins: '0 0 0 6',
                        anchor: '100%',
                        allowBlank: true
                    }]
                }],
                listeners: {
                    'afterrender': function() {
                        this.setLoading(true)
                    }
                }
            }, {
                xtype: 'panel',
                frame: false,
                margin: '5 0 0 0',
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
                    id: 'reset-button',
                    handler: function() {
						startData();
                        Ext.getCmp('griddata').setLoading(true);
						dataStore.proxy.url = 'data/gridStore.php';
                        dataStore.load({
                                scope: this,
                                callback: function(a, b, c) {
									Ext.getCmp('griddata').setLoading(false)
                                }
                            });
                        Ext.getCmp('gridarea_pnl').setLoading(true);
                        Ext.getCmp('searchk').allowBlank = true;
                        Ext.getCmp('searchk').clearInvalid();
                        Ext.getCmp('gridarea_pnl').getForm().reset();
                        dist = Ext.getCmp('cmb_griddistribusi');
                        dist.setValue(distribusi_id);
                        cbg = Ext.getCmp('cmb_gridcabang');
                        psk = Ext.getCmp('cmb_gridposko');
                        cbg.store.load({
                            params: {
                                'uid': distribusi_id
                            },
                            scope: this,
                            callback: function() {
                                Ext.getCmp('gridarea_pnl').setLoading(false)
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
                            dist.setReadOnly(true);
                            cbg.setReadOnly(true);
                            psk.setReadOnly(true);
                        } else if (unittypeid == 4 || unittypeid == 3) {
                            dist.setReadOnly(true);
                            cbg.setReadOnly(true);
                            psk.setReadOnly(false);
                            psk.enable();
                        } else if(unittypeid == 2){
						   this.setReadOnly(false);
							cbg.setReadOnly(false);
							psk.setReadOnly(false);
							psk.enable();
						} else {
                            dist.setReadOnly(true);
                            cbg.setReadOnly(false);
                            psk.setReadOnly(false);
                            psk.disable()
                        }
                    }
                }, {
                    xtype: 'button',
                    text: 'Cari',
                    id: 'search-button',
                    disabled: false,
                    handler: function() {
					Ext.getCmp('griddata').setLoading(true);
                        filterForm = Ext.getCmp('gridarea_pnl');
                        if (filterForm.getForm().isValid() == true) {
                            var tglawal = Ext.getCmp('awal').getValue();
                            var awal = Ext.util.Format.date(tglawal, 'd/m/Y');
                            var tglakhir = Ext.getCmp('akhir').getValue();
                            var akhir = Ext.util.Format.date(tglakhir, 'd/m/Y');
                            var jcari = Ext.getCmp('jenisk').getValue();
                            var pcari = Ext.getCmp('searchk').getValue();
                            var distribusi = Ext.getCmp('cmb_griddistribusi').getValue();
                            var cabang = Ext.getCmp('cmb_gridcabang').getValue();
                            var posko = Ext.getCmp('cmb_gridposko').getValue();
							var tdiff=(tglakhir.getTime() - tglawal.getTime())
							if(Math.ceil(tdiff / (1000 * 3600 * 24)) <= 30 )
							{
                            dataStore.proxy.url = 'data/gridStore.php?cari=true&periodawal=' + awal + '&periodakhir=' + akhir + '&jcari=' + jcari +'&pcari='+pcari+'&d='+distribusi+'&=c'+cabang+'&p='+posko;
                            dataStore.load({
                                scope: this,
                                callback: function(a, b, c) {
                                    // console.log(b.resultSet.count)
                                    if (b.resultSet.count == 0) {
                                        Ext.Msg.alert('Perhatian', 'Data tidak ditemukan !')
										Ext.getCmp('griddata').setLoading(false);
                                    }else{
									Ext.getCmp('griddata').setLoading(false);
									}
                                }
                            });
							}else{
							Ext.Msg.alert('Perhatian', 'Periode pencarian laporan berdasarkan tanggal tidak boleh melebihi 30 hari !');
							Ext.getCmp('griddata').setLoading(false);
							}
                        } else {
                            Ext.Msg.alert('Peringatan', 'Parameter pencarian belum ditentukan !')
                        }
                    }
                }]
            }]
        }, {
            region: 'center',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start',
            },
            items: [{
                xtype: 'grid',
                flex: 0.8,
                layout: 'fit',
                id: 'griddata',
                store: dataStore,
                viewConfig: {
                    preserveScrollOnRefresh: true,
                    loadMask: false,
                    scroll: true,
                    getRowClass: function(record) {
                        sts = record.get('STATUS')
                        if (sts == 'Nyala')
                            return 'Nyala';
                        if (sts == 'Nyala Sementara')
                            return 'Sementara'
                        if (sts == 'Dalam Perjalanan')
                            return 'Perjalanan';
                        if (sts == 'Dalam Pengerjaan')
                            return 'Pengerjaan'
                    }
                },
                columns: [{
                    text: 'No.Lapor',
                    width: 130,
                    sortable: false,
                    dataIndex: 'ID_TIKET'
                }, {
                    text: 'Status',
                    width: 100,
                    sortable: true,
                    dataIndex: 'STATUS',
                    tdCls: 'x-change-cell'

                }, {
                    text: 'Tgl.Lapor',
                    width: 125,
                    sortable: true,
                    dataIndex: 'TGL'
                }, {
                    text: 'Nama',
                    width: 125,
                    sortable: true,
                    dataIndex: 'NAMAPELAPOR'
                }, {
                    text: 'Alamat',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'ALAMATPELAPOR'
                }, {
                    text: 'Telp',
                    width: 110,
                    sortable: true,
                    dataIndex: 'TELPPELAPOR'
                }, {
                    text: 'Unit',
                    width: 125,
                    sortable: true,
                    dataIndex: 'UNITNAME'
                }],
                stripeRows: true,
                bbar: Ext.create('Ext.PagingToolbar', {
                    displayInfo: true,
                    store: dataStore,
                    displayMsg: 'Menampilkan laporan {0} - {1} dari {2}',
                    emptyMsg: "Laporan tidak tersedia",
                    id: 'paging'
                }),
                listeners: {
                    afterrender: function() {
                        Ext.getCmp('griddata').setLoading(true)
						startData();
                    },
                    cellclick: function(gridView, htmlElement, columnIndex, dataRecord, a, b) {
                        paramsId = dataRecord.data.ID_TIKET;
                        Ext.getCmp('detlap').setTitle('Detail Laporan : ' + paramsId)
                        Ext.getCmp('detailFormpanel').add({
                            xtype: 'form',
                            id: 'detailForm',
                            autoScroll: true,
                            listeners: {
                                'afterrender': function() {
                                    this.setLoading(true)
                                }
                            },
                            fieldDefaults: {
                                labelWidth: 70,
                                anchor: '100%'
                            },
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: 'No. Lapor',
                                name: 'ID_TIKET'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'ID Pel',
                                name: 'IDPEL'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Pelapor',
                                name: 'NAMAPELAPOR'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Tgl. Lapor',
                                name: 'TGL'
                            }, {
                                xtype: 'textarea',
                                fieldLabel: 'Alamat',
                                name: 'ALAMATPELAPOR',
                                rows: 3
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Telp',
                                name: 'TELPPELAPOR'
                            }, {
                                xtype: 'textarea',
                                fieldLabel: 'Penyebab Padam',
                                name: 'CAUSE',
                                rows: 3
                            }, {
                                xtype: 'textarea',
                                fieldLabel: 'Tindakan',
                                name: 'ACTION',
                                rows: 3
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'status',
                                name: 'STATUS'
                            }],
                            bbar: {
                                xtype: 'button',
                                text: 'Tutup Hal. Detil',
                                height: 30,
                                handler: function() {
                                    Ext.getCmp('detlap').hide();
                                }
                            }
                        })

                        Ext.getCmp('detailpanel').add({
                            xtype: 'panel',
                            id: 'mybox_4',
                            layout: 'fit',
                            listeners: {
                                'afterrender': function() {
                                    this.setLoading(true)
                                }
                            },
                            items: [{
                                    xtype: 'gmappanel',
                                    id: 'detailmap',
                                    zoomLevel: 5,
                                    setCenter: {
                                        lat: -2.51515,
                                        lng: 117.58667
                                    },
                                    listeners: {
                                        'mapready': function(map) {

                                            var shapesAreaStore = Ext.create('Ext.data.Store', {
                                                fields: ['warna', 'ckoor', 'koord'],
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

                                                            if (countries.length != 0) {
                                                                map.gmap.fitBounds(bounds);
                                                            };
                                                            countries[countries.length - 1].setMap(map.gmap);
                                                        }

                                                        var addListenersOnMarkers = function(mark) {
                                                            var infoWindow = new google.maps.InfoWindow({
                                                                maxWidth: 460,
                                                                maxHeight: 500
                                                            });
                                                            google.maps.event.addListener(mark, 'click', function(event) {
                                                                var contentString = ' <iframe width="400" height="355px" src="info/infodetil.php?nolapor=' + mark.nolapor + '&status=' + mark.status + '&tgl=' + mark.tgl + '&user=' + mark.usernm + '&regu=' + mark.regu + '&gbr=' + mark.image + '" frameborder="0" />';
                                                                infoWindow.setContent(contentString);
                                                                infoWindow.setPosition(event.latLng);

                                                                infoWindow.open(map.gmap);

                                                            });
                                                        }

                                                        var detailggStore = Ext.create('Ext.data.Store', {
                                                            fields: ['ID_TIKET', 'LATITUDE', 'LONGITUDE', 'STATUS', 'KODESTATUS', 'IDPEL', 'TGL','TGLEKSEKUSI', 'NAMAPELAPOR',
                                                                'ALAMATPELAPOR', 'TELPPELAPOR', 'CAUSE', 'ACTION', 'OLDSTATUS', 'IMAGE', 'ICON', 'USERNAME', 'NAMAREGU'
                                                            ],
                                                            proxy: {
                                                                type: 'ajax',
                                                                url: 'data/detailgridStore.php?id=' + paramsId,
                                                                actionMethods: {
                                                                    read: 'POST'
                                                                },
                                                                reader: {
                                                                    type: 'json',
                                                                    root: 'data',
                                                                }
                                                            },
                                                            autoLoad: true,
                                                            listeners: {
                                                                'load': function(a, b) {
                                                                    var marker = [];
                                                                    for (var i = 0; i < b.length; i++) {
                                                                        marker[i] = new google.maps.Marker({
                                                                            position: new google.maps.LatLng(b[i].data.LATITUDE, b[i].data.LONGITUDE),
                                                                            icon: 'resources/img/' + b[i].data.ICON,
                                                                            map: map.gmap,
                                                                            nolapor: b[i].data.ID_TIKET,
                                                                            status: b[i].data.OLDSTATUS,
                                                                            tgl: b[i].data.TGLEKSEKUSI,
                                                                            usernm: b[i].data.USERNAME,
                                                                            regu: b[i].data.NAMAREGU,
                                                                            image: b[i].data.IMAGE
                                                                        });
                                                                        addListenersOnMarkers(marker[i])
                                                                    }

                                                                    var form = Ext.getCmp('detailForm');
                                                                    form.loadRecord(this.data.first());

                                                                    Ext.getCmp('mybox_4').setLoading(false);
                                                                    form.setLoading(false);

                                                                    google.maps.event.addDomListener(document.getElementById('dpj_cek' + dataRecord.data.ID_TIKET), 'click', function() {
                                                                        if (Ext.getCmp('dpj_cek' + dataRecord.data.ID_TIKET).checked == false) {
                                                                            for (var i = 0; i < b.length; i++) {
                                                                                if (marker[i].status == 'Dalam Perjalanan') {
                                                                                    marker[i].setMap(null);
                                                                                }
                                                                            }
                                                                        } else {
                                                                            for (var i = 0; i < b.length; i++) {
                                                                                if (marker[i].status == 'Dalam Perjalanan') {
                                                                                    marker[i].setMap(map.gmap);
                                                                                }
                                                                            }
                                                                        }
                                                                    });

                                                                    google.maps.event.addDomListener(document.getElementById('dp_cek' + dataRecord.data.ID_TIKET), 'click', function() {
                                                                        if (Ext.getCmp('dp_cek' + dataRecord.data.ID_TIKET).checked == false) {
                                                                            for (var i = 0; i < b.length; i++) {
                                                                                if (marker[i].status == 'Dalam Pengerjaan') {
                                                                                    marker[i].setMap(null);
                                                                                }
                                                                            }
                                                                        } else {
                                                                            for (var i = 0; i < b.length; i++) {
                                                                                if (marker[i].status == 'Dalam Pengerjaan') {
                                                                                    marker[i].setMap(map.gmap);
                                                                                }
                                                                            }
                                                                        }
                                                                    });

                                                                    google.maps.event.addDomListener(document.getElementById('nyalas_cek' + dataRecord.data.ID_TIKET), 'click', function() {
                                                                        if (Ext.getCmp('nyalas_cek' + dataRecord.data.ID_TIKET).checked == false) {
                                                                            for (var i = 0; i < b.length; i++) {
                                                                                if (marker[i].status == 'Nyala Sementara') {
                                                                                    marker[i].setMap(null);
                                                                                }
                                                                            }
                                                                        } else {
                                                                            for (var i = 0; i < b.length; i++) {
                                                                                if (marker[i].status == 'Nyala Sementara') {
                                                                                    marker[i].setMap(map.gmap);
                                                                                }
                                                                            }
                                                                        }
                                                                    });

                                                                    google.maps.event.addDomListener(document.getElementById('pnyala_cek' + dataRecord.data.ID_TIKET), 'click', function() {
                                                                        if (Ext.getCmp('pnyala_cek' + dataRecord.data.ID_TIKET).checked == false) {
                                                                            for (var i = 0; i < b.length; i++) {
                                                                                if (marker[i].status == 'Nyala') {
                                                                                    marker[i].setMap(null);
                                                                                }
                                                                            }
                                                                        } else {
                                                                            for (var i = 0; i < b.length; i++) {
                                                                                if (marker[i].status == 'Nyala') {
                                                                                    marker[i].setMap(map.gmap);
                                                                                }
                                                                            }
                                                                        }
                                                                    });

                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                },
                                Ext.create('Ext.Window', {
                                    xtype: 'window',
                                    closable: false,
                                    minimizable: false,
                                    title: 'Filter',
                                    id: 'cwx' + dataRecord.data.ID_TIKET,
                                    height: 150,
                                    headerPosition: 'top',
                                    width: 130,
                                    padding: '0 5 0 5',
                                    constrain: true,
                                    resizable: false,
                                    x: 80,
                                    y: 10,
                                    items: [{
                                        xtype: 'checkbox',
                                        hideEmptyLabel: true,
                                        boxLabel: 'Perjalanan',
                                        id: 'dpj_cek' + dataRecord.data.ID_TIKET,
                                        inputValue: 'dpj',
                                        checked: true,
                                    }, {
                                        xtype: 'checkbox',
                                        hideEmptyLabel: true,
                                        boxLabel: 'Pengerjaan',
                                        id: 'dp_cek' + dataRecord.data.ID_TIKET,
                                        inputValue: 'dp_cek',
                                        checked: true,
                                    }, {
                                        xtype: 'checkbox',
                                        hideEmptyLabel: true,
                                        boxLabel: 'Nyala Sementara',
                                        id: 'nyalas_cek' + dataRecord.data.ID_TIKET,
                                        inputValue: 'nyalas',
                                        checked: true,
                                    }, {
                                        xtype: 'checkbox',
                                        hideEmptyLabel: true,
                                        boxLabel: 'Nyala',
                                        id: 'pnyala_cek' + dataRecord.data.ID_TIKET,
                                        inputValue: 'nyala',
                                        checked: true,
                                    }]
                                })
                            ]
                        })
                        Ext.getCmp('detlap').show();
                        if (Ext.getCmp('cwx' + dataRecord.data.ID_TIKET).isVisible() == false) {
                            Ext.getCmp('cwx' + dataRecord.data.ID_TIKET).setVisible(true);
                        } else {
                            Ext.getCmp('cwx' + dataRecord.data.ID_TIKET).setVisible(false);
                            Ext.getCmp('cwx' + dataRecord.data.ID_TIKET).setVisible(true);
                        }

                    }
                }
            }]
        },
        Ext.create('Ext.Window', {
            closable: true,
            minimizable: false,
            title: 'Detil Laporan',
            id: 'detlap',
            closeAction: "hide",
            maximized: true,
            constrainHeader: true,
            layout: 'border',
            items: [{
                region: 'center',
                layout: 'fit',
                id: 'detailpanel',
            }, {
                region: 'east',
                layout: 'fit',
                id: 'detailFormpanel',
                split: true,
                width: 300,
                frame: false,
                bodyPadding: '7 7 3 7',
            }]
        })
    ],
    listeners: {
        beforeclose: function() {
		    stopData();
            Ext.getCmp('searchk').allowBlank = true;
            Ext.getCmp('searchk').clearInvalid();
            Ext.getCmp('gridarea_pnl').getForm().reset();
            dist = Ext.getCmp('cmb_griddistribusi');
            dist.setValue(distribusi_id);
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
                dist.setReadOnly(true);
                cbg.setReadOnly(true);
                psk.setReadOnly(true);
            } else if (unittypeid == 4 || unittypeid == 3) {
                dist.setReadOnly(true);
                cbg.setReadOnly(true);
                psk.setReadOnly(false);
                psk.enable();
            }  else if(unittypeid == 2){
			   this.setReadOnly(false);
				cbg.setReadOnly(false);
				psk.setReadOnly(false);
				psk.enable();
			}else {
                dist.setReadOnly(true);
                cbg.setReadOnly(false);
                psk.setReadOnly(false);
                psk.disable()
            }
            Ext.getCmp('detlap').hide();

        }
    }
});