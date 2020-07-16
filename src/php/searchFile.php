<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $file = $tmp['form']['file'];

    $result = array();

    // $searchFile = function($putamierda) use ($result, $dir){
    function searchFile($dir){
        global $result;
        global $file;

        $cdir = scandir($dir);

        foreach ($cdir as $key => $value){
            $currFile = new stdClass();
            $newDir = $dir . '/' . $value;
            if (!in_array($value, array(".",".."))){
                if($value !== '.DS_Store'){
                    $currFile->name = $value;
                    $currFile->path = $newDir;
                    $extension = pathinfo($newDir, PATHINFO_EXTENSION);
                    if(!strlen($extension)){
                        $currFile->type = mime_content_type($newDir);
                    }else{
                        $currFile->type = $extension;
                    }

                    if(strpos(strtolower($value), strtolower($file)) !== false) array_push($result, $currFile);
                    if(is_dir($dir . '/' . $value)) searchFile($newDir);

                }
            }
        }
        return $result;
    };

    echo json_encode(searchFile('../../root'));
?>