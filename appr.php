<?php
	$key = "";
	if(isset($_GET['key']))
		$key=$_GET['key'];
	$act = "";
	if(isset($_GET['act']))
		$act=$_GET['act'];
	
	$key = "anim/storage/".str_replace(".","dot",$key).".file";
	
	if($act=='set')	//write mode
	{
		$method = $_SERVER['REQUEST_METHOD'];
		if($method=='POST')
			$val = file_get_contents("php://input");
		else if(isset($_GET['val']))
			$val = $_GET['val'];
		else
			$val = "";
		
		if(!file_exists($key))
		{
			$path=pathinfo($key);
			mkdir($path['dirname'], 777, TRUE);
		}
		file_put_contents($key, $val);
		print "ok";
	}
	else if($act=='get')			//read
	{
		if(file_exists($key))
			print file_get_contents($key);
		else
			print "error: path not found";
	}
	else
		header("HTTP/1.0 404 Not Found");
?>