<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];

    
    function fileInfo($route){
        $result = new stdClass();
        $file->name = basename($route);
        $file->path = $newDir;
        $file->type = mime_content_type($newDir);
        $file->size = filesize($newDir);
        $file->mtime = filemtime($newDir);
        // $file->content = dirToArray($newDir);
        $file->parent = $route;

        return $result;
    }

    echo json_encode(fileInfo($path));
?>