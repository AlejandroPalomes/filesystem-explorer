<?php

$path = $_POST['folderPath'] . $_POST['dir_name'];


if(!mkdir($path, 0777, false)) {
    die('Fallo al crear las carpetas...');
}



?>