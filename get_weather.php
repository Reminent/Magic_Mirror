<?php
	header("Content-Type: text/xml; charset=utf-8");
	echo file_get_contents("http://api.yr.no/weatherapi/locationforecast/1.9/?lat=62.39;lon=17.28");
?>