<?php
header("Access-Control-Allow-Origin: *");
header("Content-type: application/json");
require('functions.inc.php');
include 'route.php';

$route = new Route();

$route->add('/',function(){
	$statusCode = 200;

	$jsonResponse = array(
		"error" => false,
		"string" => "",
		"answer" => 0
	);

	$x = $_REQUEST['x'];
	$y = $_REQUEST['y'];

	$jsonResponse = validateInputs($x, $y);

	if ($jsonResponse['error']){
		$statusCode = 400;
	}else{
		$answer=add($x,$y);

		$jsonResponse['string']=$x."+".$y."=".$answer;
		$jsonResponse['answer']=$answer;
	}

	if ($statusCode == 200){
		header("HTTP/1.1 200 OK");
	}else {
		header("HTTP/1.1 400 Bad Request");
	}

	echo json_encode($jsonResponse);
});

$route->add('discovery',function(){
	$jsonResponse = array(
		"operator" => "add",
	);

	header("HTTP/1.1 200 OK");

	echo json_encode($jsonResponse);
});


$route->submit();
