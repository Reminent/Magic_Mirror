<?php
	header("Content-Type: text/xml; charset=utf-8");
	echo file_get_contents("http://reminent.no-ip.org/slimapi/public/quote");
?>