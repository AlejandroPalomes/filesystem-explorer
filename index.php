<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Local FileSystem</title>
</head>

<body>
<?php
echo __DIR__ . '<br>';
echo __FILE__ . '<br>';


//Read files and folders inside directory
//$files = scandir('./');
//echo '<pre>';
//var_dump($files);
//echo '</pre>';

//File fet contents, file_put_contents
echo filesize('index.txt');




?>

   
</body>

</html>