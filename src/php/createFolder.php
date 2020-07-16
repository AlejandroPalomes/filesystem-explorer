<?php

$tmp = json_decode(file_get_contents("php://input"), true);
$path = $tmp['dirdata']['folderPath'] . '/' . $tmp['dirdata']['folderName'];

if(mkdir($path, 0777, false)) {
    echo $path;
}else{
    echo 'Error';
}
