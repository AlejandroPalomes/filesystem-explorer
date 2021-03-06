<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Local FileSystem</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <link rel="stylesheet" href="src/css/style.css">
    <link rel="shortcut icon" href="src/img/icons/folder.png" type="image/x-icon">
</head>

<body>
    <!-- Navbar -->
    <div class="general__container d-flex flex-column justify-content-between">
        <nav class="navbar navbar-expand-lg navbar-dark bg-navbar shadow-sm">
            <a class="navbar-brand ml-4" href="#"><img class="logo" src="src/img/logos/logo.png"></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
    
            <div class="collapse navbar-collapse " id="navbarSupportedContent">
                <div class="col-4 ml-auto">
                    <input id="searchFolder" class="form-control mr-sm-2" type="search" placeholder="Search file" aria-label="Search">
                </div>
            </div>
        </nav>
        <!-- End Navbar-->
        <!-- File Zone-->
        <div class="main d-flex justify-content-between">
            <div class="menu shadow">
                <ul id='sideMenu' class="sideMenu nav flex-column sidebar">
                </ul>
            </div>
            <div id="contentWindow">
                <div class="contentWindow__navbar d-flex justify-content-between align-items-center">
                    <nav id="breadcrumb" class="contentWindow__breadcrumb" aria-label="breadcrumb">
                        <ol id="breadcrumb-ol" class="breadcrumb">
                        </ol>
                    </nav>
                    <!-- Button trigger modal -->
                    <button id="optionsButton" type="button" class="button_principal mr-3">+</button>
                    <!-- <button id="optionsButton" type="button" class="button_principal mr-3" data-toggle="modal" data-target="#staticBackdrop">+</button> -->
                </div>
                <div id="fileDisplay" class="px-3">
                    <div id="folderDisplay" class="d-flex flex-wrap"></div>
                    <div id="archiveDisplay" class="d-flex flex-wrap"></div>
                </div>
    
                <!-- Modal -->
                <div class="modal fade modal-folder" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1"
                    role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticBackdropLabel">Create Folder</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form action="src/php/createFolder.php" method="post" id="createFolderForm">
                                    <input type="hidden" name="folderPath" id="folderPath"/>
                                    <input class="create_folder pl-2" type="text" name="folderName" id="folderName" placeholder="New Folder"/>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary createFolderButton" id="createFolderBtn">Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="infoWindow">
                <div class="infoPreview d-flex align-items-center justify-content-center">
                    <img id="infoPreview-img" src="src/img/icons/unknown.png" height="50%" alt="">
                </div>
                <div class="infoBody  d-flex align-items-center justify-content-center">
                    <div class="infoBody__contaienr">
                        <div class="d-flex flex-column mb-3">
                            <span>Name</span>
                            <span id="infoBody-name">Undefined</span>
                        </div>
                        <div class="d-flex flex-column mb-3">
                            <span>Type</span>
                            <span id="infoBody-type">Unknown</span>
                        </div>
                        <div class="d-flex flex-column mb-3">
                            <span>Size</span>
                            <span id="infoBody-size">0kb</span>
                        </div>
                        <div class="d-flex flex-column mb-3">
                            <span>Last modification</span>
                            <span id="infoBody-mtime">Unknown</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--Footer-->
        <footer class="footer">
            <div class="d-flex justify-content-between align-items-center">
                <span class="font-weight-normal ml-4">Made by Alejandro Palomes</span>
                <div class="mr-4">
                    <a href="https://www.linkedin.com/in/alejandropalomes/?locale=en_US"><img class="icon-xxss" src="src/img/logos/linkedin.png"></a>
                    <a href="https://github.com/AlejandroPalomes"><img class="icon-xxss" src="src/img/logos/github.png"></a>
                    <a href="https://www.instagram.com/shailfidd/"><img class="icon-xxss" src="src/img/logos/instagram.png"></a>
                </div>
            </div>
        </footer>
        <div id="rightClick" class="rightClick d-none">
            <ul class="mt-2">
                <li class="pt-2 pb-2 pl-4 rClickOption">Preview</li>
                <li class="pt-2 pb-2 pl-4 rClickOption">Rename</li>
                <li class="pt-2 pb-2 pl-4 rClickOption">Move to</li>
                <li class="pt-2 pb-2 pl-4 rClickOption"><a href="#" id='downloadFile' download>Download</a></li>
                <li class="pt-2 pb-2 pl-4 rClickOption">Remove</li>
            </ul>
        </div>
        <div id="createOptions" class="createOptions d-none">
            <ul class="mt-2">
                <li class="pt-2 pb-2 pl-4 createOption">Folder</li>
                <li class="pt-2 pb-2 pl-4 createOption">Upload File</li>
                <!-- <li class="pt-2 pb-2 pl-4 createOption">Upload Folder</li> -->
            </ul>
        </div>
    </div>
    <div class="modal fade" id="mediaPlayer" tabindex="-1" role="dialog" aria-labelledby="mediaPlayerTitle" aria-hidden="true">
        <div class="modal-dialog d-flex flex-column" role="document">
            <div class="d-flex justify-content-center pt-5">
                <h5 class="modal__player--title pt-5" id="mediaPlayerTitle"></h5>
            </div>
            <div class="modal-container d-flex flex-column align-items-center">
                <audio id="audioTag" class="d-none pointer-events" controls>
                    <source src="" type="audio/mp3">
                </audio>
                <video id="videoTag" class="d-none pointer-events" width="1280" height="720" controls>
                    <source src="" type="video/mp4">
                </video>
                <img id="imgTag" class="d-none imgPreview pointer-events" src="" alt="">
                <iframe id="iframepdf" src="" class="d-none pointer-events"></iframe>
            </div>
        </div>
    </div>
    <div class="modal fade" id="renameFile" tabindex="-1" role="dialog" aria-labelledby="renameFileTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="renameTitle">Rename</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="text" name="" id="renameInput">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button id="renameConfirmBtn" type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="uploadFile" tabindex="-1" role="dialog" aria-labelledby="uploadFileTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="uploadTitle">Upload files</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form action="src/php/uploadFile.php" method="post" enctype="multipart/form-data">
                        Select file/files to upload:
                        <input type="file" name="fileToUpload" id="fileToUpload">
                        <!-- <input type="submit" value="Upload Image" name="submit"> -->
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button id="uploadFileConfirmBtn" type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    <a href="#" id='downloadFolder' class="d-none" download></a>
    <script
  src="https://code.jquery.com/jquery-3.5.1.js"
  integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc="
  crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous">
    </script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
        integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src='src/js/script.js'></script>
</body>

</html>