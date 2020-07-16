<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];

    function removeFile($route){
        if(is_dir($route)){
            $files = array_diff(scandir($route), array('.','..'));
            foreach ($files as $file) {
            (is_dir("$route/$file")) ? removeFile("$route/$file") : unlink("$route/$file");
            }
            return rmdir($route);
        }else{
            return unlink($route);
        }
    }

    echo json_encode(removeFile($path));
    // echo json_encode('Helloo');
?>