<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];

    function fileInfo($route){
        $result = new stdClass();
        $result->name = basename($route);
        $result->path = $route;

        $extension = pathinfo($route, PATHINFO_EXTENSION);
        if(!strlen($extension)){
            $result->type = mime_content_type($route);
        }else{
            $result->type = $extension;
        }
        
        $result->size = filesize($route);
        // $date = new dateTime(filemtime($route));
        $result->mtime = date ("F d Y, H:i", filemtime($route));
        // $file->content = dirToArray($newDir);

        return $result;
    }

    echo json_encode(fileInfo($path));
?>