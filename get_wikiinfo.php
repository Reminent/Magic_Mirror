<?php
	header("Content-Type: application/json; charset=utf-8");
	echo file_get_contents("http://localhost:8080/fuckyou");
?>