<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];

    function fileInfo($route){
        $result = new stdClass();
        $result->name = basename($route);
        $result->path = $route;
        $result->type = mime_content_type($route);
        $result->size = filesize($route);
        $result->mtime = filemtime($route);
        // $file->content = dirToArray($newDir);

        return $result;
    }

    echo json_encode(fileInfo($path));
?>