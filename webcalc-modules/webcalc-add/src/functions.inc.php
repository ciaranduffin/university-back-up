<?php
// Calculator Add Function - no error checking
function add($x, $y)
{
	return $x+$y;
}

function isInteger($input){
    if(filter_var($input, FILTER_VALIDATE_INT) !== false){
		return true;
	   }else{
		   return false;
	   }
}

function validateInputs($x, $y){
	$output = array(
		"error" => false,
		"string" => "",
		"answer" => 0
	);
	
	if ($x == null || $y == null){
		$output = array(
			"error" => true,
			"string" => "One or both required parameters (x and y) are missing.",
			"answer" => 0
		);
	}
	elseif(!is_numeric($x) || !is_numeric($y)){
		$output = array(
			"error" => true,
			"string" => "One or both required parameters (x and y) are non numeric.",
			"answer" => 0
		);
	}
	elseif(!isInteger($x) || !isInteger($y)) {
		$output = array(
			"error" => true,
			"string" => "One or both required parameters (x and y) are not whole numbers.",
			"answer" => 0
		);
	}

	return $output;
}