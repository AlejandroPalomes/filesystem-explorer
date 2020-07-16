<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];

    // function showPreview($route){

    //     // header('Content-Type: application/pdf');
    //     // header('Content-Disposition: inline; filename='.$route);
    //     // header('Content-Transfer-Encoding: binary');
    //     // header('Accept-Ranges: bytes');

    //     return readfile($route);
    // }
    if (file_exists($path)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="'.basename($path).'"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($path));
        readfile($path);
        exit;
    }

    // echo json_encode(showPreview($path));
?>