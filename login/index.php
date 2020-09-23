<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Dashboard Mobile APKT ::Login::</title>
		<link rel="stylesheet" href="style.css" type="text/css" media="screen">
		<script type="text/javascript" src="jquery.min.js"></script>
		<script type="text/javascript" src="cek.js"></script>
	</head>
	<body id="home">
		<div class="rain">
			<div class="logo"><img src="image/logologin.png"></img></div>
			<div class="border start">
				<form  method="POST">
					<label for="nama">Username :</label>
					<input id="nama" name="nama" type="text" placeholder="Username"/>
					<label for="pass">Password :</label>
					<input id="pass" name="pass" type="password" placeholder="Password"/>
					<!--<label for="tema">Tema :</label>
					<select id="tema" name="tema" type="text">
					<option value="neptune">default (neptune)</option>
					<option value="classic">classic</option>
					<option value="gray">gray</option>
					<option value="access">accessibility</option>
					</select>-->
                     <input type="button" class="btn" name="btn" id="btnLogin" onclick="check_login();" value="Login"/>
				</form>
			</div>
		</div>
	</body>
</html>