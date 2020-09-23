function check_login()
{
    //Mengambil value dari input username & Password
    var username = $('#nama').val();
    var password = $('#pass').val();
	var tema = $('#tema').val();
    //Ubah alamat url berikut, sesuaikan dengan alamat script pada komputer anda
    var url_login    = 'cekuser.php';
    var url_admin    = '../';
     
    //Ubah tulisan pada button saat click login
    $('#btnLogin').attr('value','Silahkan tunggu ...!');
     
    //Gunakan jquery AJAX
    $.ajax({
        url     : url_login,
        //mengirimkan username dan password ke script login.php
        data    : 'var_usn='+username+'&var_pwd='+password+'&var_tma='+tema, 
        //Method pengiriman
        type    : 'POST',
        //Data yang akan diambil dari script pemroses
        dataType: 'html',
        //Respon jika data berhasil dikirim
        success : function(pesan){
            if(pesan=='ok'){
                //Arahkan ke halaman admin jika script pemroses mencetak kata ok
                window.location = url_admin;
            }
            else{
                //Cetak peringatan untuk username & password salah
                alert("Maaf Username dan Password yang anda masukan belum tepat.");
                $('#btnLogin').attr('value','Coba lagi ...!');
            }
        },
    });
}