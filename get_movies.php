<?php
	header("Content-Type: text/xml; charset=utf-8");
	echo file_get_contents("http://www.sf.se/sfmedia/external/rss/premieres");
?>