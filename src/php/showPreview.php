<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];

    function showPreview($route){

        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename='.$route);
        header('Content-Transfer-Encoding: binary');
        header('Accept-Ranges: bytes');

        return readfile($route);
    }

    echo json_encode(showPreview($path));
?>