Ext.define('MyDesktop.DataStore', {});


var today = new Date();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
var blthn = mm + '' + yyyy;

var dtStore = Ext.create('Ext.data.Store', {
    fields: ['PID', 'Title', 'Lat', 'Lng'],
    data: [{
        'PID': 110,
        'Title': 'PLN Wilayah Nangroe Aceh Darussalam',
        'Lat': 5.562299,
        'Lng': 95.334808,
    }, {
        'PID': 120,
        'Title': 'PLN Wilayah Sumatera Utara',
        'Lat': 3.61561,
        'Lng': 98.672585,
    }, {
        'PID': 180,
        'Title': 'PLN Wilayah Riau & Kep. Riau',
        'Lat': 0.536064,
        'Lng': 101.450274,
    }, {
        'PID': 131,
        'Title': 'PLN Wilayah Sumatera Barat',
        'Lat': -0.945972,
        'Lng': 100.372342,
    }, {
        'PID': 171,
        'Title': 'PLN Distribusi Lampung',
        'Lat': -5.365094,
        'Lng': 105.227212,
    }, {
        'PID': 161,
        'Title': 'PLN Wilayah Bangka Belitung',
        'Lat': -2.158129,
        'Lng': 106.1296486,
    }, {
        'PID': 427,
        'Title': 'PLN Distribusi Jawa Barat & Banten',
        'Lat': -6.920867,
        'Lng': 107.606638,
    }, {
        'PID': 101,
        'Title': 'PLN Distribusi Jawa Tengah dan DI Yogjakarta',
        'Lat': -7.031919,
        'Lng': 110.418326,
    }, {
        'PID': 103,
        'Title': 'PLN Distribusi Jawa Timur',
        'Lat': -7.26474,
        'Lng': 112.743165,
    }, {
        'PID': 2,
        'Title': 'PLN Distribusi Jakarta dan Tangerang',
        'Lat': -6.180303,
        'Lng': 106.833212,
    }, {
        'PID': 287,
        'Title': 'PLN Distribusi Bali',
        'Lat': -8.66989,
        'Lng': 115.228048,
    }, {
        'PID': 44,
        'Title': 'PLN Wilayah Nusa Tenggara Barat',
        'Lat': -8.577371,
        'Lng': 116.081644,
    }, {
        'PID': 31,
        'Title': 'PLN Wilayah Sulawesi Utara,Tengah & Gorontalo',
        'Lat': 1.463441,
        'Lng': 124.833046,
    }, {
        'PID': 32,
        'Title': 'PLN Wilayah Sulawesi Selatan dan Barat',
        'Lat': -5.166528,
        'Lng': 119.448279,
    }, {
        'PID': 42,
        'Title': 'PLN Wilayah Papua & Papua Barat',
        'Lat': -2.5428,
        'Lng': 140.702891,
    }, {
        'PID': 210,
        'Title': 'PLN Wilayah Kalimantan Barat',
        'Lat': -0.082379,
        'Lng': 109.387996,

    }, {
        'PID': 230,
        'Title': 'PLN Wilayah Kalimantan Timur',
        'Lat': -1.244597,
        'Lng': 116.872922,

    }, {
        'PID': 221,
        'Title': 'PLN Wilayah Kalimantan Selatan & Tengah',
        'Lat': -3.4387974,
        'Lng': 114.8251828,
    }, {
        'PID': 41,
        'Title': 'PLN Nusa Tenggara Timur',
        'Lat': -10.1557494,
        'Lng': 123.6336471,
    }, {
        'PID': 430,
        'Title': 'PLN Maluku & Maluku Utara',
        'Lat': -3.6989581,
        'Lng': 128.1797808,
    }, {
        'PID': 140,
        'Title': 'PLN Sumatera Selatan, Jambi & Bengkulu',
        'Lat': -2.979512,
        'Lng': 104.748273,
    }]
});

var dist = Ext.create('Ext.data.Store', {
    fields: ['UNITID', 'UNITNAME'],
    proxy: {
        type: 'ajax',
        url: 'data/api/distribusi.php',
        reader: {
            type: 'json',
            root: 'ROW'
        }
    },
	autoLoad:false
});

var cabang = Ext.create('Ext.data.Store', {
    fields: ['UNITID', 'UNITNAME'],
    proxy: {
        type: 'ajax',
        url: 'data/api/cabang.php',
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

var rayon = Ext.create('Ext.data.Store', {
    fields: ['RID', 'RNAME'],
    proxy: {
        type: 'ajax',
        url: 'data/api/rayon.php',
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

var posko = Ext.create('Ext.data.Store', {
    fields: ['UNITID', 'UNITNAME'],
    proxy: {
        type: 'ajax',
        url: 'data/api/posko.php',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'ROW'
        }
    }
});

var rayonCari = Ext.create('Ext.data.Store', {
    fields: ['unitid', 'unitname', 'unitarea'],
    proxy: {
        type: 'ajax',
        url: 'data/api/rayon_cari.php',
		actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'ROW',
        }
    }
});

var jenis = Ext.create('Ext.data.Store', {
    fields: ['jns', 'jname'],
    data: [{
            "jns": "id_tiket",
            "jname": "No Lapor"
        }, {
            "jns": "telppelapor",
            "jname": "No Telepon"
        }, {
            "jns": "id_plg",
            "jname": "ID Pelanggan"
        }, {
            "jns": "namapelapor",
            "jname": "Nama Pelapor"
        }, {
            "jns": "alamatpelapor",
            "jname": "Alamat"
        },
        //...
    ]
});

var dataStore=Ext.create('Ext.data.Store', {
	fields: ['ID_TIKET', 'IDPEL', 'TGL', 'NAMAPELAPOR', 'ALAMATPELAPOR', 'UNITNAME','TELPPELAPOR', 'RAYON_POSKO', 'LASTSTATUS', 'LATITUDE', 'LONGITUDE','NOTIFIKASI'],
    pageSize: 10,
    proxy: {
        type: 'ajax',
        url: 'data/api/gridStore.php',
        reader: {
            type: 'json',
            root: 'ROW',
            totalProperty: 'jumlah'
        }
    },
});

/*-------------------------------------------------------------------*/
var dataTrackStoreAll = Ext.create('Ext.data.Store', {
	fields: ['USERNAME', 'UNITNAME', 'AREANAME', 'STATUS', 'LATITUDE', 'LONGITUDE'],
    pageSize: 10,
	autoLoad:true,
    proxy: {
        type: 'ajax',
        url: 'data/gridTrackAll.php',
        reader: {
            type: 'json',
            root: 'data'
		}
    },
	listeners:{
		load: function(a,b,c){
			panelall=Ext.getCmp("panelAll");
			// panelall.setTitle('All ('+b.length+')');
		}
	}
});



/*-------------------------------------------------------------------*/

var dataHistStore=Ext.create('Ext.data.Store', {
	fields: ['ID_TIKET', 'IDPEL', 'TGL', 'NAMAPELAPOR', 'ALAMATPELAPOR', 'TELPPELAPOR', 'UNITNAME', 'STATUS', 'LATITUDE', 'LONGITUDE', 'LASTSTATUS'],
    pageSize: 10,
    proxy: {
        type: 'ajax',
        url: 'data/api/historygridstore.php',
        reader: {
            type: 'json',
            root: 'ROW',
            totalProperty: 'jumlah'
        }
    },
});



var reguKoord = Ext.create('Ext.data.Store', {
    fields: ['REGUID', 'REGUNAME', 'POSKOID','UNITNAME'],
    proxy: {
        type: 'ajax',
        url: 'data/api/regu.php',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'ROW',
        }
    },
    autoLoad:true
});




// var emergencyinterval = setInterval(function () {
					// emergencyStore.load();
					// Ext.getCmp('notify').show(document);
				// }, 5000);
