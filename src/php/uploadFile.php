<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $file = $tmp['form']['fileToUpload'];
    $target_dir = $tmp['form']['target'];

    // foreach($_FILES['fileToUpload']['name'] as $key => $value) {
    //     $type = ltrim(strstr($_FILES['fileToUpload']['type'][$key], '/'), '/');
    //     // if ($type == 'jpg' || $type == 'jpeg'){
    //         // $target_file = $target_dir . $lastId . '-' . $_POST['product-color'] . '-' . $key . '.' . $type;
    //         $target_file = $target_dir . $lastId . '-' . $_POST['product-color'] . '-' . $key . '.jpg';
    //         move_uploaded_file($_FILES['fileToUpload']['tmp_name'][$key] ,$target_file);
    //     // }
    // }
    echo $file;

    // if($_FILES["fileToUpload"]["name"] != '')
    // {
    // $test = explode('.', $_FILES["fileToUpload"]["name"]);
    // $ext = end($test);
    // $name = rand(100, 999) . '.' . $ext;
    // $location = '../../root/' . $name;
    // move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $location);
    // // echo '<img src="'.$location.'" height="150" width="225" class="img-thumbnail" />';
    // }

    // echo json_encode(removeFile($path));
    // echo json_encode('Helloo');
?>