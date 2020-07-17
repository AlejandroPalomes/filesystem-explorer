<?php
    function dirToArray($dir) {

        $result = array();
        $cdir = scandir($dir);

        foreach ($cdir as $key => $value){
            if (!in_array($value, array(".",".."))){
                $newDir = $dir . '/' . $value;
                if (is_dir($dir . '/' . $value)){
                    $folder = new stdClass();
                    $folder->name = $value;
                    $folder->path = $newDir;
                    $folder->type = mime_content_type($newDir);
                    $folder->size = filesize($newDir);
                    $folder->mtime = filemtime($newDir);
                    $folder->content = dirToArray($newDir);
                    $folder->parent = $dir;

                    $result[$value] = $folder;
                }
            }
        }
        return $result;
    }

    echo json_encode(dirToArray('../../root'));
?>