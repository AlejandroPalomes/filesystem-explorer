<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];
    $targetPath = $tmp['form']['targetPath'];

    echo rename($path, $targetPath);
    // echo json_encode('Helloo');
?>