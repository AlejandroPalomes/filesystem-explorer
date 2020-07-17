<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];

    
    function loadFolder($route){
        $folder = scandir($route);
        foreach ($folder as $key => $value){
            if (!in_array($value, array(".","..")) && $value !== '.DS_Store'){
                $newDir = $route . '/' . $value;
                $file = new stdClass();
                $file->name = $value;
                $file->path = $newDir;
                $extension = pathinfo($newDir, PATHINFO_EXTENSION);
                if(!strlen($extension)){
                    $file->type = mime_content_type($newDir);
                }else{
                    $file->type = $extension;
                }

                $result[$value] = $file;
            }
        }
        return $result;
    }

    echo json_encode(loadFolder($path));
?>