Ext.define('MyDesktop.GridHistory', {
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

var tabhistgrid = Ext.create('Ext.panel.Panel', {
    title: 'Tranksaksi History',
    cls: 'inner-tab-custom',
    id: 'gridhistory',
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
                id: "gridhistarea_pnl",
                frame: false,
                bodyPadding: '2 2 2 2',
                items: [{
                    xtype: 'fieldset',
                    title: 'Periode',
                    items: [{
                        xtype: 'datefield',
                        name: 'startdt',
                        itemId: 'startdthist',
                        id: 'awalhist',
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
                        itemId: 'enddthist',
                        id: 'akhirhist',
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
                        id: 'cmb_histgriddistribusi',
                        nama: 'dist',
                        displayField: 'UNITNAME',
                        valueField: 'UNITID',
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
                                        Ext.getCmp('gridhistarea_pnl').setLoading(false)
                                    }
                                });
                                this.setValue(distribusi_id);
                                cbg = Ext.getCmp('cmb_histgridcabang');
                                psk = Ext.getCmp('cmb_histgridposko');
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
                                cbg = Ext.getCmp('cmb_histgridcabang');
                                psk = Ext.getCmp('cmb_histgridposko');
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
                        id: 'cmb_histgridcabang',
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
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Pencarian',
                    items: [{
                        xtype: 'combobox',
                        emptyText: 'pilih jenis pencarian',
                        store: jenis,
                        id: 'histjenisk',
                        valueField: 'jns',
                        displayField: 'jname',
                        anchor: '100%',
                        allowBlank: true,
                        editable: false,
                        listeners: {
                            'select': function() {
                                if (this.value) {
                                    Ext.getCmp('histsearchk').allowBlank = false;
                                }
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        emptyText: 'cari',
                        id: 'histsearchk',
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
                    id: 'histreset-button',
                    handler: function() {
                        Ext.getCmp('histgriddata').setLoading(true);
                        dataHistStore.proxy.url = 'data/api/historygridStore.php';
                        dataHistStore.load({
                                scope: this,
                                callback: function(a, b, c) {
                                    Ext.getCmp('histgriddata').setLoading(false)
                                }
                            });
                        Ext.getCmp('gridhistarea_pnl').setLoading(true);
                        Ext.getCmp('histsearchk').allowBlank = true;
                        Ext.getCmp('histsearchk').clearInvalid();
                        Ext.getCmp('gridhistarea_pnl').getForm().reset();
                        dist = Ext.getCmp('cmb_griddistribusi');
                        dist.setValue(distribusi_id);
                        cbg = Ext.getCmp('cmb_histgridcabang');
                        psk = Ext.getCmp('cmb_histgridposko');
                        cbg.store.load({
                            params: {
                                'uid': distribusi_id
                            },
                            scope: this,
                            callback: function() {
                                Ext.getCmp('gridhistarea_pnl').setLoading(false)
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
                    id: 'histsearch-button',
                    disabled: false,
                    handler: function() {
                        Ext.getCmp('histgriddata').setLoading(true);
                        filterForm = Ext.getCmp('gridhistarea_pnl');
                        if (filterForm.getForm().isValid() == true) {
                            var tglawal = Ext.getCmp('awalhist').getValue();
                            var awal = Ext.util.Format.date(tglawal, 'd/m/Y');
                            var tglakhir = Ext.getCmp('akhirhist').getValue();
                            var akhir = Ext.util.Format.date(tglakhir, 'd/m/Y');
                            var jcari = Ext.getCmp('histjenisk').getValue();
                            var pcari = Ext.getCmp('histsearchk').getValue();
                            var distribusi = Ext.getCmp('cmb_histgriddistribusi').getValue();
                            var cabang = Ext.getCmp('cmb_histgridcabang').getValue();
                            var posko = Ext.getCmp('cmb_histgridposko').getValue();
                            var tdiff=(tglakhir.getTime() - tglawal.getTime())
                            if(Math.ceil(tdiff / (1000 * 3600 * 24)) <= 30 )
                            {
                            dataHistStore.proxy.url = 'data/api/historygridstore.php?cari=true&periodawal=' + awal + '&periodakhir=' + akhir + '&jcari=' + jcari +'&pcari='+pcari+'&d='+distribusi+'&c='+cabang+'&p='+posko;
                            dataHistStore.load({
                                scope: this,
                                callback: function(a, b, c) {
                                    console.log(a,b)
                                    if (b.resultSet.count == 0) {
                                        Ext.Msg.alert('Perhatian', 'Data tidak ditemukan !')
                                        Ext.getCmp('histgriddata').setLoading(false);
                                    }else{
                                    Ext.getCmp('histgriddata').setLoading(false);
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
                id: 'histgriddata',
                store: dataHistStore,
                viewConfig: {
                    preserveScrollOnRefresh: true,
                    loadMask: false,
                    scroll: true,
                    getRowClass: function(record) {
                        sts = record.get('STATUS1')
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
                    text: 'NOMOR LAPOR',
                    width: 130,
                    sortable: false,
                    dataIndex: 'ID_TIKET'
                }, {
                    text: 'STATUS',
                    width: 90,
                    sortable: true,
                    dataIndex: 'LASTSTATUS',
                    tdCls: 'x-change-cell'

                }, {
                    text: 'TGL LAPOR',
                    width: 125,
                    sortable: true,
                    dataIndex: 'TGL'
                }, {
                    text: 'NAMA PELAPOR',
                    width: 125,
                    sortable: true,
                    dataIndex: 'NAMAPELAPOR'
                }, {
                    text: 'ALAMAT PELAPOR',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'ALAMATPELAPOR'
                }, {
                    text: 'TELP',
                    width: 110,
                    sortable: true,
                    dataIndex: 'TELPPELAPOR'
                }, {
                    text: 'UNIT',
                    width: 125,
                    sortable: true,
                    dataIndex: 'UNITNAME'
                }],
                stripeRows: true,
                bbar: Ext.create('Ext.PagingToolbar', {
                    displayInfo: true,
                    store: dataHistStore,
                    displayMsg: 'Menampilkan laporan {0} - {1} dari {2}',
                    emptyMsg: "Laporan tidak tersedia",
                    id: 'histpaging'
                }),
                listeners: {
                    afterrender: function(a,b) {
                        Ext.getCmp('histgriddata').setLoading(true);
                    },
                    cellclick: function(gridView, htmlElement, columnIndex, dataRecord, a, b) {
                        paramsId = dataRecord.data.ID_TIKET;
                        Ext.getCmp('histdetlap').setTitle('Detail Laporan : ' + paramsId)
                        Ext.getCmp('histdetailFormpanel').add({
                            xtype: 'form',
                            id: 'histdetailForm',
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
                                name: 'KODESTATUS',
                            }],
                            bbar: {
                                xtype: 'button',
                                text: 'Tutup Hal. Detil',
                                height: 30,
                                handler: function() {
                                    Ext.getCmp('histdetlap').hide();
                                }
                            }
                        })

                        Ext.getCmp('histdetailpanel').add({
                            xtype: 'panel',
                            id: 'histmybox_4',
                            layout: 'fit',
                            listeners: {
                                'afterrender': function() {
                                    this.setLoading(true)
                                }
                            },
                            items: [{
                                    xtype: 'gmappanel',
                                    id: 'histdetailmap',
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
                                                            fields: ['ID_TIKET', 'LATITUDE', 'LONGITUDE', 'STATUS', 'IDPEL', 'TGL', 'NAMAPELAPOR','STATUS',
                                                                'ALAMATPELAPOR', 'TELPPELAPOR', 'CAUSE', 'ACTION', 'KODESTATUS', 'IMAGE', 'ICON', 'USERNAME', 'NAMAREGU'
                                                            ],
                                                            proxy: {
                                                                type: 'ajax',
                                                                url: 'data/api/detailgridhistStore.php?id=' + paramsId,
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
                                                                'load': function(a, b) {
                                                                    var marker = [];
                                                                    for (var i = 0; i < b.length; i++) {
                                                                        marker[i] = new google.maps.Marker({
                                                                            position: new google.maps.LatLng(b[i].data.LATITUDE, b[i].data.LONGITUDE),
                                                                            icon: 'resources/img/' + b[i].data.ICON,
                                                                            map: map.gmap,
                                                                            nolapor: b[i].data.ID_TIKET,
                                                                            status: b[i].data.STATUS,
                                                                            tgl: b[i].data.TGL,
                                                                            usernm: b[i].data.USERNAME,
                                                                            regu: b[i].data.NAMAREGU,
                                                                            image: b[i].data.IMAGE
                                                                        });
                                                                        addListenersOnMarkers(marker[i])
                                                                    }

                                                                    var form = Ext.getCmp('histdetailForm');
                                                                    form.loadRecord(this.data.first());

                                                                    Ext.getCmp('histmybox_4').setLoading(false);
                                                                    form.setLoading(false);

                                                                    google.maps.event.addDomListener(document.getElementById('hdpj_cek' + dataRecord.data.ID_TIKET), 'click', function() {
                                                                        if (Ext.getCmp('hdpj_cek' + dataRecord.data.ID_TIKET).checked == false) {
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

                                                                    google.maps.event.addDomListener(document.getElementById('hdp_cek' + dataRecord.data.ID_TIKET), 'click', function() {
                                                                        if (Ext.getCmp('hdp_cek' + dataRecord.data.ID_TIKET).checked == false) {
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

                                                                    google.maps.event.addDomListener(document.getElementById('hnyalas_cek' + dataRecord.data.ID_TIKET), 'click', function() {
                                                                        if (Ext.getCmp('hnyalas_cek' + dataRecord.data.ID_TIKET).checked == false) {
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

                                                                    google.maps.event.addDomListener(document.getElementById('hpnyala_cek' + dataRecord.data.ID_TIKET), 'click', function() {
                                                                        if (Ext.getCmp('hpnyala_cek' + dataRecord.data.ID_TIKET).checked == false) {
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
                                    id: 'hcwx' + dataRecord.data.ID_TIKET,
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
                                        id: 'hdpj_cek' + dataRecord.data.ID_TIKET,
                                        inputValue: 'dpj',
                                        checked: true,
                                    }, {
                                        xtype: 'checkbox',
                                        hideEmptyLabel: true,
                                        boxLabel: 'Pengerjaan',
                                        id: 'hdp_cek' + dataRecord.data.ID_TIKET,
                                        inputValue: 'dp_cek',
                                        checked: true,
                                    }, {
                                        xtype: 'checkbox',
                                        hideEmptyLabel: true,
                                        boxLabel: 'Nyala Sementara',
                                        id: 'hnyalas_cek' + dataRecord.data.ID_TIKET,
                                        inputValue: 'nyalas',
                                        checked: true,
                                    }, {
                                        xtype: 'checkbox',
                                        hideEmptyLabel: true,
                                        boxLabel: 'Nyala',
                                        id: 'hpnyala_cek' + dataRecord.data.ID_TIKET,
                                        inputValue: 'nyala',
                                        checked: true,
                                    }]
                                })
                            ]
                        })
                        Ext.getCmp('histdetlap').show();
                        if (Ext.getCmp('hcwx' + dataRecord.data.ID_TIKET).isVisible() == false) {
                            Ext.getCmp('hcwx' + dataRecord.data.ID_TIKET).setVisible(true);
                        } else {
                            Ext.getCmp('hcwx' + dataRecord.data.ID_TIKET).setVisible(false);
                            Ext.getCmp('hcwx' + dataRecord.data.ID_TIKET).setVisible(true);
                        }

                    }
                }
            }]
        },
        Ext.create('Ext.Window', {
            closable: true,
            minimizable: false,
            title: 'Detil Laporan',
            id: 'histdetlap',
            closeAction: "hide",
            maximized: true,
            constrainHeader: true,
            layout: 'border',
            items: [{
                region: 'center',
                layout: 'fit',
                id: 'histdetailpanel',
            }, {
                region: 'east',
                layout: 'fit',
                id: 'histdetailFormpanel',
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
            Ext.getCmp('histsearchk').allowBlank = true;
            Ext.getCmp('histsearchk').clearInvalid();
            Ext.getCmp('gridhistarea_pnl').getForm().reset();
            dist = Ext.getCmp('cmb_histgriddistribusi');
            dist.setValue(distribusi_id);
            cbg = Ext.getCmp('cmb_histgridcabang');
            psk = Ext.getCmp('cmb_histgridposko');
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
               //this.setReadOnly(false);
                cbg.setReadOnly(false);
                psk.setReadOnly(false);
                psk.enable();
            }else {
                dist.setReadOnly(true);
                cbg.setReadOnly(false);
                psk.setReadOnly(false);
                psk.disable()
            }
            Ext.getCmp('histdetlap').hide();

        }
    }
});