<?php
	header("Content-Type: text/xml; charset=utf-8");
	if (isset($_REQUEST["date"])){
		$date = $_REQUEST["date"];
		echo file_get_contents("http://api.dryg.net/dagar/v2.1/" . $date);
	}
?>