<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];
    $name = $tmp['form']['name'];

    function renameFile($route, $newName){
        $extension = pathinfo($route, PATHINFO_EXTENSION);
        (strlen($extension)) ? $completeName = $newName . '.' . $extension : $completeName = $newName;
        $newDir = str_replace(basename($route), $completeName, $route);
        return rename($route, $newDir);
    }

    echo json_encode(renameFile($path, $name));
    // echo json_encode('Helloo');
?>