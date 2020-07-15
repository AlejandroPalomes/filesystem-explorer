<?php
    function dirToArray($dir) {

        $result = array();

        $cdir = scandir($dir);

        foreach ($cdir as $key => $value){
            if (!in_array($value, array(".",".."))){
                if (is_dir($dir . '/' . $value)){
                    $newDir = $dir . '/' . $value;
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
                elseif($value !== '.DS_Store'){
                    $newDir = $dir . '/' . $value;
                    $file = new stdClass();
                    $file->name = $value;
                    $file->path = $newDir;
                    $file->type = mime_content_type($newDir);
                    $file->size = filesize($newDir);
                    $file->mtime = filemtime($newDir);
                    $file->parent = $dir;

                    $result[] = $file;
                    // $result[] = $value;
                }
            }
        }

        return $result;
    }

    echo json_encode(dirToArray('../../root'));
?>