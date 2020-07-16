<?php

    $tmp = json_decode(file_get_contents("php://input"), true);

    
    $newPath = preg_replace('/~/', '/', $_FILES['path']['name']);
    $target_dir = $newPath . '/' . $_FILES['file']['name'];
    
    if($_FILES['file']['size'] <= 20000000){
        echo move_uploaded_file($_FILES['file']['tmp_name'], $target_dir);
    }else{
        echo 'sizeExceed';
    }

    // echo $_FILES['file']['size'];
    // echo move_uploaded_file($_FILES['file']['tmp_name'], '../../root/test.pdf');
    // echo json_encode($newPath . '/' . $_FILES['file']['name']);
?>