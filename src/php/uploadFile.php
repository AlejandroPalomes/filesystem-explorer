<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $path = $tmp['form']['path'];

    $target_dir = $path;
    foreach($_FILES['uploadedFile']['name'] as $key => $value) {
        $type = ltrim(strstr($_FILES['uploadedFile']['type'][$key], '/'), '/');
        // if ($type == 'jpg' || $type == 'jpeg'){
            // $target_file = $target_dir . $lastId . '-' . $_POST['product-color'] . '-' . $key . '.' . $type;
            $target_file = $target_dir . $lastId . '-' . $_POST['product-color'] . '-' . $key . '.jpg';
            move_uploaded_file($_FILES['uploadedFile']['tmp_name'][$key] ,$target_file);
        // }
    }

    echo json_encode(removeFile($path));
    // echo json_encode('Helloo');
?>