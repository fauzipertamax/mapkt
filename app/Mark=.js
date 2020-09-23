Ext.define('MyDesktop.Mark', {
    requires: []
});

var tabmark = Ext.create('Ext.panel.Panel', {
    title: 'Marking Office',
    cls: 'inner-tab-custom',
    id: 'mark',
    closeAction: 'destroy',
    layout: 'border',
    closable: true,
    hideMode: Ext.isIE ? 'offsets' : 'display',
    items: {
		region: 'center',
        layout: 'fit',
        id: 'markpanel',
		xtype: 'gmappanel',
		zoomLevel: 5,
		setCenter: {
			lat: -2.51515,
            lng: 117.58667
        },
		listeners: {
			'afterrender': function () {
				this.setLoading(true)
			},
			
			'mapready': function (map) {
				var maps = map.gmap;
				var infoWindow = new google.maps.InfoWindow();
				var image = {
					url: 'image/pin_blue.png',
					size: new google.maps.Size(40, 64)
				};
				
				var markStore = Ext.create('Ext.data.Store', {
					fields: ['UnitId', 'UnitTypeId', 'NamaKantor', 'Keterangan', 'Koordinat', 'Zoom'],
					proxy: {
						type: 'ajax',
						url: 'data/marking_office_read.php',
						reader: { type: 'json'}
						},
					autoLoad: true,
					listeners: {
						load: function (x,b,c) {
							/*------------------------------------*/							
							var namakantor = b[0].data.NamaKantor;
							Ext.getCmp('markpanel').setLoading(false)
							if (namakantor != "") {
								var namakantor = b[0].data.NamaKantor;
								var keterangan = b[0].data.Keterangan;
								var koordinat = b[0].data.Koordinat;
								var zoom = b[0].data.Zoom;
			
								var kr = koordinat.split(',');
								var dtlat = kr[0];
								var dtlng = kr[1];
								
								var myLatLng = {lat: Number(dtlat), lng: Number(dtlng)};
                                map.gmap.setZoom(Number(zoom));
								map.gmap.setCenter(myLatLng);
                                var marker = new google.maps.Marker({
									position: myLatLng,
									map: maps,
									icon:image,
									title: namakantor,
									});
									
								var addListenersOnMarkers = function(mark) {
									
									google.maps.event.addListener(mark, 'click', function(event) {
										
										deleteMarking = function(){
											Ext.MessageBox.confirm('Konfirmasi', 'Apakah anda yakin akan menghapus ini?', function (buttonText) {
												if (buttonText == "yes") {
													Ext.Ajax.request({
														url: 'data/marking_office_delete.php',
														success: function (a) {
															if (a.responseText == "true") {
																Ext.Msg.alert('Perhatian', 'Proses hapus berhasil !', function(btn, text){
																	if(btn == 'ok'){
																		infoWindow.close(map.gmap);
																		mark.setMap(null);
																		markStore.load();
																	}
																});
															} else {
																Ext.Msg.alert('Peringatan', 'Proses hapus gagal !')
															}
														}
													});
												}
											});
										}
										
										var EditForm = '<p><div class="marker-edit">'+
										'<form method="POST" name="frm" id="frm">'+
										'<table>'+
										'<tr><td>Nama Kantor</td><td><input type="text" name="NamaKantor" id="NamaKantor" value="'+namakantor+'"></td></tr>'+
										'<tr><td>Keterangan</td><td><input type="text" name="Keterangan" id="Keterangan" value="'+keterangan+'"></td></tr>'+
										'<tr><td colspan="2">'+
										'<button type="button" name="simpan" id="simpan" onclick="updateMarking()">Simpan</button>'+
										'<button type="button" name="hapus" id="hapus" onclick="deleteMarking()">Hapus</button>'+
										'</td></tr>'+
										'</table>'+
										'</form>';
										infoWindow.setContent(EditForm);
                                        infoWindow.setPosition(event.latLng);
										infoWindow.open(map.gmap);
									});
								};
								addListenersOnMarkers(marker);
								
									
									
							} else {
								
								var yourLatLng = {lat: -2.51515, lng: 117.58667};
								map.gmap.setZoom(5);
								map.gmap.setCenter(yourLatLng);
								google.maps.event.addListener(maps, 'click', function(event) {
								var InsertForm = '<p><div class="marker-edit">'+
								'<form method="POST" name="frm" id="frm">'+
								'<table>'+
								'<tr><td>Nama Kantor</td><td><input type="text" name="NamaKantor" id="NamaKantor"></td></tr>'+
								'<tr><td>Keterangan</td><td><input type="text" name="Keterangan" id="Keterangan"></td></tr>'+
								'<tr><td>Koordinat</td><td><input type="text" name="Koordinat" id="Koordinat" value="'+event.latLng+'"></td></tr>'+        
								'<tr><td>Zoom</td><td><input type="text" name="Zoom" id="Zoom" value="'+map.gmap.getZoom()+'"></td></tr>'+        
								'<tr><td colspan="2"><button type="button" name="simpan" id="simpan" onclick="simpanMarking()">Simpan</button></td></tr>'+
								'</table>'+
								'</form>';
								
								var InsertFormss = '<html class="x-quirks"><head></head><body class="x-body x-gecko" id="ext-gen1018">'+
								'<div id="panel-1009" style="width: 300px; height: 205px;" class="x-panel x-panel-default-framed x-border-box">'+
								'<div id="panel-1009_header" class="x-panel-header x-header x-header-horizontal x-docked x-unselectable x-panel-header-default-framed x-horizontal x-panel-header-horizontal x-panel-header-default-framed-horizontal x-top x-panel-header-top x-panel-header-default-framed-top x-docked-top x-panel-header-docked-top x-panel-header-default-framed-docked-top" style="width: 300px; right: auto; left: -5px; top: -5px;">'+
								'<div class="x-header-body x-panel-header-body x-panel-header-body-default-framed x-panel-header-body-horizontal x-panel-header-body-default-framed-horizontal x-panel-header-body-top x-panel-header-body-default-framed-top x-panel-header-body-docked-top x-panel-header-body-default-framed-docked-top x-box-layout-ct x-panel-header-body-default-framed-horizontal x-panel-header-body-default-framed-top x-panel-header-body-default-framed-docked-top" id="panel-1009_header-body" style="width: 280px;">'+
								'<div role="presentation" class="x-box-inner " id="panel-1009_header-innerCt" style="width: 280px; height: 16px;">'+
								'<div class="x-box-target" id="panel-1009_header-targetEl" style="width: 280px;">'+
								'<div id="panel-1009_header_hd" unselectable="on" class="x-component x-header-text-container x-panel-header-text-container x-panel-header-text-container-default-framed x-box-item x-component-default" style="right: auto; left: 0px; top: 0px; margin: 0px; width: 280px;">'+
								'<span unselectable="on" class="x-header-text x-panel-header-text x-panel-header-text-default-framed" id="panel-1009_header_hd-textEl">Informasi Kantor</span>'+
								'</div></div></div></div></div>'+

								'<div style="padding: 0px; width: 290px; left: 0px; top: 31px; height: 164px;" class="x-panel-body x-panel-body-default-framed x-panel-body-default-framed x-noborder-trbl" id="panel-1009-body">'+
								'<span style="display: table; width: 100%; table-layout: fixed;" id="panel-1009-outerCt">'+
								'<div class="" style="display:table-cell;height:100%;vertical-align:top;padding:5px 5px 5px 5px" id="panel-1009-innerCt">'+
								'<div id="form-1010" class="x-panel x-panel-default" style="height: 130px;">'+
								'<div class="x-panel-body x-panel-body-default x-panel-body-default x-noborder-trbl" id="form-1010-body" style="width: 280px; left: 0px; top: 0px; height: 130px;">'+
								'<span style="display: table; width: 100%; table-layout: fixed;" id="form-1010-outerCt">'+
								'<div class="" style="display:table-cell;height:100%;vertical-align:top;" id="form-1010-innerCt">'+

								'<table cellpadding="0" id="NamaKantor" class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-anchor-form-item" style="table-layout: fixed; width: 274px;"><tbody><tr class="x-form-item-input-row" id="NamaKantor-inputRow" role="presentation"><td width="80" valign="top" class="x-field-label-cell" halign="right" style="" id="NamaKantor-labelCell" role="presentation"><label unselectable="on" style="width:75px;margin-right:5px;" class="x-form-item-label x-unselectable x-form-item-label-right" for="NamaKantor-inputEl" id="NamaKantor-labelEl">Nama Kantor:</label></td><td colspan="2" id="NamaKantor-bodyEl" class="x-form-item-body  " role="presentation" style="width: 100%;"><input type="text" autocomplete="off" class="x-form-field x-form-text  " name="NamaKantor-inputEl" size="1" id="NamaKantor-inputEl" aria-invalid="false" style="width: 100%;"></td></tr></tbody></table>'+
								'<table cellpadding="0" id="Keterangan" class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-anchor-form-item" style="table-layout: fixed; width: 274px;"><tbody><tr class="x-form-item-input-row" id="Keterangan-inputRow" role="presentation"><td width="80" valign="top" class="x-field-label-cell" halign="right" style="" id="Keterangan-labelCell" role="presentation"><label unselectable="on" style="width:75px;margin-right:5px;" class="x-form-item-label x-unselectable x-form-item-label-right" for="Keterangan-inputEl" id="Keterangan-labelEl">Keterangan:</label></td><td colspan="2" id="Keterangan-bodyEl" class="x-form-item-body  " role="presentation" style="width: 100%;"><input type="text" autocomplete="off" class="x-form-field x-form-text  " name="Keterangan-inputEl" size="1" id="Keterangan-inputEl" aria-invalid="false" style="width: 100%;"></td></tr></tbody></table>'+
								'<table cellpadding="0" id="Koordinat" class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-anchor-form-item" style="table-layout: fixed; width: 274px;"><tbody><tr class="x-form-item-input-row" id="Koordinat-inputRow" role="presentation"><td width="80" valign="top" class="x-field-label-cell" halign="right" style="" id="Koordinat-labelCell" role="presentation"><label unselectable="on" style="width:75px;margin-right:5px;" class="x-form-item-label x-unselectable x-form-item-label-right" for="Koordinat-inputEl" id="Koordinat-labelEl">Koordinat:</label></td><td colspan="2" id="Koordinat-bodyEl" class="x-form-item-body  " role="presentation" style="width: 100%;"><input type="text" autocomplete="off" class="x-form-field x-form-text  " name="Koordinat" size="1" id="Koordinat"  value="'+event.latLng+'" aria-invalid="false" style="width: 100%;"></td></tr></tbody></table>'+
								'<table cellpadding="0" id="Zoom" class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-anchor-form-item" style="table-layout: fixed; width: 274px;"><tbody><tr class="x-form-item-input-row" id="Zoom-inputRow" role="presentation"><td width="80" valign="top" class="x-field-label-cell" halign="right" style="" id="Zoom-labelCell" role="presentation"><label unselectable="on" style="width:75px;margin-right:5px;" class="x-form-item-label x-unselectable x-form-item-label-right" for="Zoom-inputEl" id="Zoom-labelEl">Zoom:</label></td><td colspan="2" id="Zoom-bodyEl" class="x-form-item-body  " role="presentation" style="width: 100%;"><input type="text" name="Zoom" size="1" id="Zoom"  value="kkkkkk" style="width: 100%;"></td></tr></tbody></table>'+

								'</div>'+
								'</span>'+
								'</div>'+
								'</div>'+

								'<a id="btn-simpan" tabindex="0" unselectable="on" hidefocus="on" role="button" class="x-btn x-unselectable x-btn-default-small x-noicon x-btn-noicon x-btn-default-small-noicon"><span unselectable="on" class="x-btn-wrap" id="btn-simpan-btnWrap"><span class="x-btn-button" id="btn-simpan-btnEl"><span unselectable="on" class="x-btn-inner x-btn-inner-center" id="btn-simpan-btnInnerEl">Simpan</span><span style="" unselectable="on" class="x-btn-icon-el  " id="btn-simpan-btnIconEl" role="img"></span></span></span></a>'+

								'</div>'+
								'</span>'+
								'</div>'+
								'</div>'+
								'</body>'+
								'</html>';
								
								
								var InsertFormsss = '<html class="x-quirks"><head>'+
								'<body class="x-body x-gecko" id="ext-gen1018">'+
								'<div id="panel-1009" style="width: 300px; height: 162px;" class="x-panel x-panel-default-framed x-border-box">'+
								
								'<div id="panel-1009_header" class="x-panel-header x-header x-header-horizontal x-docked x-unselectable x-panel-header-default-framed x-horizontal x-panel-header-horizontal x-panel-header-default-framed-horizontal x-top x-panel-header-top x-panel-header-default-framed-top x-docked-top x-panel-header-docked-top x-panel-header-default-framed-docked-top" style="width: 300px; right: auto; left: -5px; top: -5px;">'+
								'<div class="x-header-body x-panel-header-body x-panel-header-body-default-framed x-panel-header-body-horizontal x-panel-header-body-default-framed-horizontal x-panel-header-body-top x-panel-header-body-default-framed-top x-panel-header-body-docked-top x-panel-header-body-default-framed-docked-top x-box-layout-ct x-panel-header-body-default-framed-horizontal x-panel-header-body-default-framed-top x-panel-header-body-default-framed-docked-top" id="panel-1009_header-body" style="width: 280px;">'+
								'<div role="presentation" class="x-box-inner " id="panel-1009_header-innerCt" style="width: 280px; height: 16px;">'+
								'<div class="x-box-target" id="panel-1009_header-targetEl" style="width: 280px;">'+
								'<div id="panel-1009_header_hd" unselectable="on" class="x-component x-header-text-container x-panel-header-text-container x-panel-header-text-container-default-framed x-box-item x-component-default" style="right: auto; left: 0px; top: 0px; margin: 0px; width: 280px;">'+
								'<span unselectable="on" class="x-header-text x-panel-header-text x-panel-header-text-default-framed" id="panel-1009_header_hd-textEl">Informasi Kantorss</span>'+
								'</div>'+
								'</div>'+
								'</div>'+
								'</div>'+
								'</div>'+
								
								'<div style="padding: 0px; width: 290px; left: 0px; top: 31px; height: 121px;" class="x-panel-body x-panel-body-default-framed x-panel-body-default-framed x-noborder-trbl" id="panel-1009-body">'+
								'<span style="display: table; width: 100%; table-layout: fixed;" id="panel-1009-outerCt">'+
								'<div class="" style="display:table-cell;height:100%;vertical-align:top;padding:5px 5px 5px 5px" id="panel-1009-innerCt">'+
								'<div id="form-1010" class="x-panel x-panel-default" style="height: 87px;">'+
								'<div class="x-panel-body x-panel-body-default x-panel-body-default x-noborder-trbl" id="form-1010-body" style="width: 280px; left: 0px; top: 0px; height: 87px;">'+
								'<span style="display: table; width: 100%; table-layout: fixed;" id="form-1010-outerCt">'+
								'<div class="" style="display:table-cell;height:100%;vertical-align:top;" id="form-1010-innerCt">'+
								'<form method="POST" name="frm" id="frm">'+
								
								'<table cellpadding="0" id="Nama" class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-anchor-form-item" style="table-layout: fixed; width: 274px;">'+
								'<tbody><tr class="x-form-item-input-row" id="Nama-inputRow" role="presentation">'+
								'<td width="80" valign="top" class="x-field-label-cell" halign="right" style="" id="Nama-labelCell" role="presentation">'+
								'<label unselectable="on" style="width:75px;margin-right:5px;" class="x-form-item-label x-unselectable x-form-item-label-right" for="Nama-inputEl" id="Nama-labelEl">Nama:</label>'+
								'</td><td colspan="2" id="Nama-bodyEl" class="x-form-item-body  " role="presentation" style="width: 100%;"><input type="text" class="x-form-field x-form-text  " name="NamaKantor" size="1" id="NamaKantor" aria-invalid="false" style="width: 100%;"></td>'+
								'<td width="21" valign="middle" style="display: none;" id="Nama-sideErrorCell" role="presentation">'+
								'<div style="display:none" class="x-form-error-msg x-form-invalid-icon" id="Nama-errorEl" role="presentation" data-errorqtip=""></div></td></tr>'+
								'</tbody></table>'+
								
								'<table cellpadding="0" id="Keterangan" class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-anchor-form-item" style="table-layout: fixed; width: 274px;">'+
								'<tbody><tr class="x-form-item-input-row" id="Keterangan-inputRow" role="presentation">'+
								'<td width="80" valign="top" class="x-field-label-cell" halign="right" style="" id="Keterangan-labelCell" role="presentation">'+
								'<label unselectable="on" style="width:75px;margin-right:5px;" class="x-form-item-label x-unselectable x-form-item-label-right" for="Keterangan-inputEl" id="Keterangan-labelEl">Keterangan:</label></td><td colspan="2" id="Keterangan-bodyEl" class="x-form-item-body  " role="presentation" style="width: 100%;">'+
								'<input type="text" class="x-form-field x-form-text  " name="Keterangan" size="1" id="Keterangan" aria-invalid="false" style="width: 100%;"></td><td width="21" valign="middle" style="display: none;" id="Keterangan-sideErrorCell" role="presentation">'+
								'<div style="display:none" class="x-form-error-msg x-form-invalid-icon" id="Keterangan-errorEl" role="presentation" data-errorqtip=""></div></td></tr></tbody></table>'+
								
								'<table cellpadding="0" id="Koordinat" class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-anchor-form-item" style="table-layout: fixed; width: 274px;"><tbody>'+
								'<tr class="x-form-item-input-row" id="Koordinat-inputRow" role="presentation"><td width="80" valign="top" class="x-field-label-cell" halign="right" style="" id="Koordinat-labelCell" role="presentation"><label unselectable="on" style="width:75px;margin-right:5px;" class="x-form-item-label x-unselectable x-form-item-label-right" for="Koordinat-inputEl" id="Koordinat-labelEl">Koordinat:</label></td>'+
								'<td colspan="2" id="Koordinat-bodyEl" class="x-form-item-body  " role="presentation" style="width: 100%;">'+
								'<input type="text" class="x-form-field x-form-text  " name="Koordinat" readonly size="1" id="Koordinat" aria-invalid="false" style="width: 100%;" value="'+event.latLng+'"></td><td width="21" valign="middle" style="display: none;" id="Koordinat-sideErrorCell" role="presentation"><div style="display:none" class="x-form-error-msg x-form-invalid-icon" id="Koordinat-errorEl" role="presentation" data-errorqtip=""></div></td></tr></tbody></table>'+

								'<table cellpadding="0" id="Zoom" class="x-field x-table-plain x-form-item x-form-type-text x-field-default x-anchor-form-item" style="table-layout: fixed; width: 274px;"><tbody>'+
								'<tr class="x-form-item-input-row" id="Koordinat-inputRow" role="presentation"><td width="80" valign="top" class="x-field-label-cell" halign="right" style="" id="Koordinat-labelCell" role="presentation"><label unselectable="on" style="width:75px;margin-right:5px;" class="x-form-item-label x-unselectable x-form-item-label-right" for="Koordinat-inputEl" id="Koordinat-labelEl">Koordinat:</label></td>'+
								'<td colspan="2" id="Koordinat-bodyEl" class="x-form-item-body  " role="presentation" style="width: 100%;">'+
								'<input type="text" class="x-form-field x-form-text  " name="Zoom" readonly size="1" id="Zoom" aria-invalid="false" style="width: 100%;" value="'+map.gmap.getZoom()+'"></td><td width="21" valign="middle" style="display: none;" id="Koordinat-sideErrorCell" role="presentation"><div style="display:none" class="x-form-error-msg x-form-invalid-icon" id="Koordinat-errorEl" role="presentation" data-errorqtip=""></div></td></tr></tbody></table>'+
								
								'</div></span></div></div>'+

								'<a id="btn-simpan" tabindex="0" unselectable="on" hidefocus="on" role="button" class="x-btn x-unselectable x-btn-default-small x-noicon x-btn-noicon x-btn-default-small-noicon">'+
								'<span unselectable="on" class="x-btn-wrap" id="btn-simpan-btnWrap"><span class="x-btn-button" id="btn-simpan-btnEl"><span unselectable="on" class="x-btn-inner x-btn-inner-center" id="btn-simpan-btnInnerEl" onclick="simpanMarking()">Simpan</span><span style="" unselectable="on" class="x-btn-icon-el  "id="btn-simpan-btnIconEl" role="img"></span></span></span></a>'+								
								'</form>'+
								'</div></span>'+
								'</div></div></body></html>';
                               
								var InsertFormss = '<iframe width="400" height="283px" src="app/formMark.php" frameborder="0" />';
								infoWindow.setContent(InsertForm);
								infoWindow.setPosition(event.latLng);
								infoWindow.open(map.gmap);
								});
							}
						}
					} // end listener
				}); //end markStore
				
	
				simpanMarking = function(){
					Ext.Ajax.request({
						url: 'data/marking_office_proses.php',
						success: function (a) {
							if (a.responseText == "true") {
								Ext.Msg.alert('Perhatian', 'Proses simpan berhasil !', function(btn, text){
									if(btn == 'ok'){
										infoWindow.close(map.gmap);
										markStore.load();
									}
								})
							} else {
								Ext.Msg.alert('Peringatan', 'Proses simpan gagal !')
							}
						},
						params: {
							NamaKantor: frm.NamaKantor.value,
							Keterangan: frm.Keterangan.value,
							Koordinat: frm.Koordinat.value,
							Zoom: frm.Zoom.value
						}
					});
				}// end function simpanMarking
				
				updateMarking = function(){
					Ext.Ajax.request({
						url: 'data/marking_office_proses.php',
						success: function (a) {
							if (a.responseText == "true") {
								Ext.Msg.alert('Perhatian', 'Proses update berhasil !', function(btn, text){
									if(btn == 'ok'){
										infoWindow.close(map.gmap);
										markStore.load();
									}
								})
							} else {
								Ext.Msg.alert('Peringatan', 'Proses update gagal !')
							}
						},
						params: {
							NamaKantor: frm.NamaKantor.value,
							Keterangan: frm.Keterangan.value
						}
					});
				}// end function updateMarking
				
				

                     
				google.maps.event.addListener(maps,'rightclick',function(){
					alert('test alert');
				});
				
			} // end map ready
		} // end listener
	}// end items
});