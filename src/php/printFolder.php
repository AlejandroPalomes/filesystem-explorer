<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];

    
    function loadFolder($route){
        $folder = scandir($route);
        foreach ($folder as $key => $value){
            if (!in_array($value, array(".",".."))){
                $newDir = $route . '/' . $value;
                $file = new stdClass();
                $file->name = $value;
                $file->path = $newDir;
                $file->type = mime_content_type($newDir);
                $file->size = filesize($newDir);
                $file->mtime = filemtime($newDir);
                // $file->content = dirToArray($newDir);
                $file->parent = $route;

                $result[$value] = $file;
            }
        }
        return $result;
    }

    echo json_encode(loadFolder($path));
?>