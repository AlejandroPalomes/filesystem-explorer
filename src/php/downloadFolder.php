<?php

    $tmp = json_decode(file_get_contents("php://input"), true);
    $dir = $tmp['form']['path'];

    $zip_file = $dir . '.zip';

    // Get real path for our folder
    $rootPath = realpath($dir);

    // Initialize archive object
    $zip = new ZipArchive();
    $zip->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE);

    // Create recursive directory iterator
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($rootPath),
        RecursiveIteratorIterator::LEAVES_ONLY
    );

    foreach ($files as $name => $file)
    {
        // Skip directories (they would be added automatically)
        if (!$file->isDir())
        {
            // Get real and relative path for current file
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($rootPath) + 1);

            // Add current file to archive
            $zip->addFile($filePath, $relativePath);
        }
    }

    // Zip archive will be created only after closing object
    $zip->close();

    //!Have a deep look at this, no needed now due to how we managed the download, but take into account for further projects. That's why we haven't delete it
    // header('Content-Description: File Transfer');
    // header('Content-Type: application/octet-stream');
    // header('Content-Disposition: attachment; filename='.basename($zip_file));
    // header('Content-Transfer-Encoding: binary');
    // header('Expires: 0');
    // header('Cache-Control: must-revalidate');
    // header('Pragma: public');
    // header('Content-Length: ' . filesize($zip_file));
    readfile($zip_file);

?>