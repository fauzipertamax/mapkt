<?php session_start(); 
if(empty($_SESSION[ 'username'])){ header( "location:login/");} else { ?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
    <title>Dashboard m-APKT</title>
	<link rel="shortcut icon" href="img/android.jpg" /> 
     <script type="text/javascript" src="extjs/examples/shared/include-ext.js?theme=<?php echo $_SESSION['tema'];?>"></script>
	 <link rel="stylesheet" href="resources/style.css" type="text/css" media="screen">
	 		<style type="text/css">

		#instructions ul li {
			list-style-type:disc;
			list-style-position:outside;
			font-size:12px;
			margin:0px 0px 0px 20px;
		}

		/* Icons */
		.ux-notification-icon-information {
			background-image: url('resources/img/icon16_info.png');
		}

		.ux-notification-icon-error {
			background-image: url('resources/img/icon16_error.png');
		}


		/* Using standard theme */
		.ux-notification-window .x-window-body {
			text-align: center;
			padding: 15px 5px 15px 5px;
		}


		/* Custom styling */
		.ux-notification-light .x-window-header-default {
			background-color: transparent !important;
			border-width: 0px !important;
		}
		
		.ux-notification-light .x-window-header-text-container-default{
			color:red;
		}

		body .ux-notification-light {
			background-image: url('resources/img/fader.png');
		}

		.ux-notification-light .x-window-body {
			text-align: left;
			padding: 15px 5px 20px 5px;
			background-color: transparent;
			border: 0px solid white;
		}
		
		.x-window-default .ux-notification-light {
		 border-color: #a2b1c5 !important;
		}
		
		.x-window{
		border-color:lightgray;
		border:0px;
		}

	</style>
    <!-- GC -->
</head>
<body>
    <div id="loading-mask" style=""></div>
    <div id="loading">
        <div class="loading-indicator">
            <img src="resources/img/puzzle_lightbulb_build_PA_md_wm.gif" width="124" height="124" style="margin-right:8px;float:left;vertical-align:top;"/>APKT - <a href="index.html">mobile dashboard</a>
            <br /><span id="loading-msg">Loading APKT Mobile Dashboard...</span>
        </div>
    </div>
	
	    <div id="viewport">

        <div id="bd">
            <div class="left-column">
                <div id="code-load" style="display:none;">
					<script type="text/javascript">var usrnme="<?php echo $_SESSION['userlkp'];?>";</script>
					<script type="text/javascript">var posko_id="<?php echo $_SESSION['unitid'];?>";</script>
					<script type="text/javascript">var area_id="<?php echo $_SESSION['area'];?>";</script>
					<script type="text/javascript">var distribusi_id="<?php echo $_SESSION['dist'];?>";</script>
					<script type="text/javascript">var unittypeid="<?php echo $_SESSION['tipe'];?>";</script>
                    <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Core API...';</script>
                    <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading UI Components...';</script>
                    <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Initializing...';</script>
						<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAh03TgGgp7nUkV8tROqZ3jzlZuLXSPrBg&v=3&libraries=drawing&sensor=false&t=k"></script>
						<script type="text/javascript" src="resources/src/GMapPanel3.js"></script>
						<!--<script type="text/javascript" src="resources/Notification.js"></script>
						<script type="text/javascript" src="resources/src/protoculous-packer.js"></script>
						<script type="text/javascript" src="sound/script/soundmanager2.js"></script>-->
						<script type="text/javascript" src="app/DataStore.js"></script>
						<script type="text/javascript">
                        Ext.Loader.setPath({
                            // 'Ext.ux.desktop': 'js',
                            MyDesktop: 'app'
                        });
						
                        Ext.require('MyDesktop.App');


                         //Mengakhiri loading setelah login
                        var hideMask = function () {
                            Ext.get('loading').remove();
                            Ext.fly('loading-mask').animate({
                                opacity: 0,
                                remove: true,
                            });
                        };

                        Ext.defer(hideMask, 1000);
						Ext.EventManager.addListener(window, 'beforeunload', this.onBeforeUnload, this, { normalized:false });

                    </script>
                </div>
            </div>

        </div><!-- end bd -->

    </div><!-- end viewport -->
</body>
</html>
<?php } ?>
