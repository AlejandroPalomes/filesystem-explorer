loadSideMenu();
requestContent('../../root');

const options = document.querySelectorAll('.rClickOption');
const createOptions = document.querySelectorAll('.createOption');
const contextMenu = document.querySelector('#rightClick');
const createMenu = document.querySelector('#createOptions');
const renameBtn = document.querySelector('#renameConfirmBtn');
const renameInp = document.querySelector('#renameInput');
const optionsBtn = document.querySelector('#optionsButton');
const createFolderBtn = document.querySelector('#createFolderBtn');
const uploadFileBtn = document.querySelector('#uploadFileConfirmBtn');
const dropArea = document.querySelector('#contentWindow');

//Drag and drop to upload file
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
};

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});


['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

function highlight(e) {
    dropArea.classList.add('highlight')
};

function unhighlight(e) {
    dropArea.classList.remove('highlight')
};

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files

    handleFiles(files)
};

function handleFiles(files) {
    ([...files]).forEach(uploadFile)
};
//End drag and drop

document.querySelector('body').addEventListener('click', e => {
    if (!e.target.classList.contains('rClickOption')) contextMenu.classList.add('d-none');
    if (!e.target.classList.contains('button_principal')) createMenu.classList.add('d-none');
});

optionsBtn.addEventListener('click', (e) => {
    createMenu.classList.remove('d-none');
    createMenu.style.left = e.clientX - 190 + 'px';
    createMenu.style.top = e.clientY + 'px';
});

renameBtn.addEventListener('click', e => {
    renameFile(e.target.dataset.path, renameInp.value);
    $('#renameFile').modal('hide');
})

createFolderBtn.addEventListener('click', createFolder);

uploadFileConfirmBtn.addEventListener('click', (e) => {
    $('#uploadFile').modal('hide');
    uploadFile(document.querySelector('#fileToUpload').files[0]);
});

options.forEach(option => {
    option.addEventListener('click', e => {
        switch (e.target.innerText) {
            case 'Remove':
                removeFile(e.currentTarget.dataset.path);
                contextMenu.classList.add('d-none');
                break;
            case 'Rename':
                renameInp.value = '';
                $('#renameFile').modal('show');
                renameBtn.dataset.path = e.currentTarget.dataset.path;
                contextMenu.classList.add('d-none');
                break;
            case 'Download':
                document.querySelector('#downloadFile').href = removeAllButLast(e.currentTarget.dataset.path, '.').replace('/', '').replace('/', '');
                contextMenu.classList.add('d-none');
                break;
            case 'Preview':
                openPreview(e.currentTarget.dataset.path, true);
                contextMenu.classList.add('d-none');
                break;
            default:
                contextMenu.classList.add('d-none');
                break;
        }
    })
})

createOptions.forEach(option => {
    option.addEventListener('click', e => {
        switch (e.target.innerText) {
            case 'Folder':
                document.querySelector('#folderName').value = '';
                $('#staticBackdrop').modal('show');
                contextMenu.classList.add('d-none');
                break;
            case 'Upload File':
                document.querySelector('#fileToUpload').value = '';
                $('#uploadFile').modal('show');
                contextMenu.classList.add('d-none');
                break;
            case 'Upload Folder':
                console.log('Ready to upload folder');
                contextMenu.classList.add('d-none');
                break;
            default:
                contextMenu.classList.add('d-none');
                break;
        }
    })
})

function loadSideMenu() {
    axios({
        method: 'get',
        url: 'src/php/searchdir.php',
    }).then((response) => {
        document.querySelector('#sideMenu').innerHTML = '';
        iterateFolders(response.data);
        document.querySelectorAll('#sideMenu [data-path]').forEach(e => {
            e.addEventListener('click', link => requestContent(link.target, false));
        });
    });
}

function iterateFolders(folder, parent) {
    let key = Object.keys(folder);
    key.forEach(e => {
        if (folder[e].type === 'directory') {
            let newId = folder[e].path.replace(/\//g, '_').replace(/\./g, '');
            let contents;
            hasContent = false;
            if (typeof folder[e].content == 'object') contents = Object.keys(folder[e].content);
            if (contents.length) hasContent = true;

            let li = document.createElement('li');
            let li2 = document.createElement('li');
            li.className = 'nav-item';
            li.dataset['test'] = newId;
            li2.className = 'nav-item';

            if (!parent) {
                li.className = `nav-item ${(hasContent) ? 'dropdwon' : ''}`;
                li.innerHTML = `
                    <a class="nav-link" data-path="${folder[e].path}" ${(hasContent) ? ' data-toggle="collapse" href="#'+ newId +'" role="button" aria-expanded="false" aria-controls="'+ newId +'"' : 'href="#"'}>${folder[e].name}</a>
                `;

                li2.id = newId;
                li2.className = 'collapse';
                li2.innerHTML = `
                <ul class="ml-4" data-father="${folder[e].path}"></ul>
                `
                document.querySelector('#sideMenu').append(li);
                if (hasContent) document.querySelector('#sideMenu').append(li2);
            } else {
                let li3 = document.createElement('li');
                li3.dataset['test'] = newId;

                if (hasContent) {
                    li.className = `nav-item dropdwon`;
                    li.innerHTML = `
                        <a class="nav-link" data-path="${folder[e].path}" ${(hasContent) ? ' data-toggle="collapse" href="#' + newId + '" role="button" aria-expanded="false" aria-controls="'+ newId +'"' : 'href="#"'}>${folder[e].name}</a>
                    `;

                    li3.id = newId;
                    li3.className = 'collapse';
                    li3.innerHTML = `<ul class="ml-4" data-father="${folder[e].path}"></ul>`
                    document.querySelector(`[data-father="${parent}"]`).append(li);
                    document.querySelector(`[data-father="${parent}"]`).append(li3);
                } else {
                    li3.innerHTML = `<a class="nav-link" data-path="${folder[e].path}" href="#">${folder[e].name}</a>`;
                    document.querySelector(`[data-father="${parent}"]`).append(li3);
                }
            }
            iterateFolders(folder[e].content, folder[e].path);
        } else {
            //console.log(folder[e].name);
        }
    });
}

function requestContent(folder, init = true) {
    const form = new FormData();

    init ? form.path = folder : form.path = folder.dataset.path;

    axios({
        method: 'POST',
        url: 'src/php/printFolder.php',
        data: {
            form
        }
    }).then((response) => {
        document.querySelector('#folderDisplay').innerHTML = '';
        document.querySelector('#archiveDisplay').innerHTML = '';
        document.querySelector('#breadcrumb').dataset.path = form.path;
        // printBreadcrumb(folder.dataset.path);
        printBreadcrumb(form.path);
        printFolder(response.data);
    });
}

function requestFileInfo(path) {
    const form = new FormData();

    form.path = path;

    axios({
        method: 'POST',
        url: 'src/php/fileInfo.php',
        data: {
            form
        }
    }).then((response) => {
        document.querySelector('#infoPreview-img').src = 'src/img/icons/' + checkImgSrc(response.data.type);
        document.querySelector('#infoBody-name').innerText = response.data.name;
        document.querySelector('#infoBody-type').innerText = response.data.type;
        document.querySelector('#infoBody-mtime').innerText = response.data.mtime;
        let totalSize;
        if (response.data.size < 1000) totalSize = response.data.size + ' bytes';
        if (response.data.size > 1000 && response.data.size < 100000) totalSize = (Math.round(response.data.size / 1000 * 10) / 10) + 'KB';
        if (response.data.size > 100000 && response.data.size < 100000000) totalSize = (Math.round(response.data.size / 1000000 * 10) / 10) + 'MB';
        document.querySelector('#infoBody-size').innerText = totalSize;
    });
}

function printFolder(folder) {
    let key = Object.keys(folder);
    key.forEach(e => {
        const div = document.createElement('div');
        div.className = 'card m-2 d-flex justify-content-center';
        div.dataset.path = folder[e].path;
        div.dataset.type = folder[e].type;

        div.innerHTML = `
            <img class="mx-auto mt-2" src="src/img/icons/${checkImgSrc(folder[e].type)}" height="65px" alt="Card image cap">
            <div class="card-body mx-auto mt-2">
                <h5 class="card-title">${folder[e].name}</h5>
            </div>
        `;

        (folder[e].type === 'directory') ? document.querySelector('#folderDisplay').append(div): document.querySelector('#archiveDisplay').append(div);
    });
    addListeners();
}

function addListeners() {
    const files = document.querySelectorAll('#fileDisplay .card');
    files.forEach(file => {
        file.addEventListener('dblclick', (e) => {
            const file = e.currentTarget.querySelector('img');
            if (file.src.includes('src/img/icons/folder.png')) {
                requestContent(e.currentTarget.dataset.path)
            } else {
                openPreview(e);
            }
        });
        file.addEventListener('click', (e) => requestFileInfo(e.currentTarget.dataset.path));
        file.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            contextMenu.classList.remove('d-none');
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';

            options.forEach(option => {
                option.dataset.path = e.currentTarget.dataset.path;
            })

        });
    });
}

function openPreview(e, isPath = false){
    $('#mediaPlayer').modal('show');
    let referenceFile = document.querySelector(`#archiveDisplay [data-path="${e}"]`);
    document.querySelector('#mediaPlayerTitle').innerText = isPath ? referenceFile.querySelector('h5').innerText : e.currentTarget.querySelector('h5').innerText;
    let playFile = null;
    let fileType = isPath ? referenceFile.dataset.type.toLowerCase() : e.currentTarget.dataset.type.toLowerCase();

    if (fileType == 'mp3') playFile = document.querySelector('#audioTag');
    if (fileType == 'mp4') playFile = document.querySelector('#videoTag');
    if (fileType == 'jpg' || fileType == 'jpeg' ||
        fileType == 'svg' || fileType == 'png') {
        document.querySelector('#imgTag').src = isPath ? e : e.currentTarget.dataset.path;
        document.querySelector('#imgTag').classList.remove('d-none');
    }
    else if((fileType == 'mp3')||(fileType == 'mp4')){
        playFile.classList.remove('d-none')
        playFile.src = isPath ? e : e.currentTarget.dataset.path;
        playFile.play();
    }else{
        document.querySelector('#iframepdf').src = removeAllButLast(isPath ? e : e.currentTarget.dataset.path, '.').replace('/', '').replace('/', '');
        document.querySelector('#iframepdf').classList.remove('d-none');
    }

    $('#mediaPlayer').on('hidden.bs.modal', function (e) {
        document.querySelector('#imgTag').classList.add('d-none');
        document.querySelector('#iframepdf').classList.add('d-none');
        if (playFile !== null) {
            playFile.classList.add('d-none')
            playFile.pause();
        }
    })
}

function removeAllButLast(string, token) {
    var parts = string.split(token);
    return parts.slice(0,-1).join('') + token + parts.slice(-1)
}

function printBreadcrumb(path) {
    const elements = path.replace('/', '').replace(/\./g, '').replace('/', '').split('/');
    const breadcrumb = document.querySelector('#breadcrumb-ol');
    let relativePath = '../..'
    breadcrumb.innerHTML = '';

    elements.forEach((e, i) => {
        const li = document.createElement('li');
        relativePath += ('/' + e);
        li.className = 'breadcrumb-item';
        if (i + 1 != elements.length) li.classList.add('breadcrumb__link');
        li.dataset.path = relativePath;
        li.textContent = e;

        breadcrumb.append(li);
    })

    const liElements = document.querySelectorAll('#breadcrumb-ol li');
    liElements.forEach((e, i) => {
        if (i + 1 < liElements.length) {
            e.addEventListener('click', e => {
                requestContent(e.target, false)
            })
        }
    });
}

function checkImgSrc(type) {
    let finalPath = '';

    switch (type) {
        case 'directory':
            finalPath = 'folder.png';
            break;
        case 'PNG':
        case 'png':
            finalPath = 'png.png';
            break;
        case 'jpg':
        case 'JPG':
        case 'JPEG':
        case 'jpeg':
            finalPath = 'jpg.png';
            break;
        case 'svg+xml':
        case 'svg':
            finalPath = 'svg.png';
            break;
        case 'docx':
        case 'doc':
            finalPath = 'doc.png';
            break;
        case 'ppt':
        case 'pptx':
            finalPath = 'ppt.png';
            break;
        case 'odt':
            finalPath = 'odt.png';
            break;
        case 'zip':
            finalPath = 'zip.png';
            break;
        case 'mp3':
        case 'mpeg':
            finalPath = 'mp3.png';
            break;
        case 'mp4':
            finalPath = 'mp4.png';
            break;
        case 'rar':
            finalPath = 'rar.png';
            break;
        case 'pdf':
            finalPath = 'pdf.png';
            break;
        case 'csv':
            finalPath = 'csv.png';
            break;
        case 'txt':
            finalPath = 'txt.png';
            break;
        case 'exe':
            finalPath = 'exe.png';
            break;

        default:
            finalPath = 'unknown.png';
            break;
    }

    return finalPath;
}

// Create Folder
function createFolder() {
    let dirdata = new FormData();
    let folderName = document.getElementById('folderName').value;
    let folderPath = document.querySelector('#breadcrumb').dataset.path;
    dirdata.folderName = folderName;
    dirdata.folderPath = folderPath;
    axios({
        method: 'POST',
        url: 'src/php/createFolder.php',
        data: {
            dirdata
        }
    }).then((response) => {
        $('#staticBackdrop').modal('hide')
        // console.log(response.data);
        // console.log(folderPath + '/' + folderName);
        if (response.data == folderPath + '/' + folderName) {
            requestContent(folderPath);
            //amagar el modal
        } else {
            //posar missatge al modal de error
            console.log('Failed to create');
        }
    });
}






const searchInput = document.querySelector('#searchFolder');
searchInput.addEventListener('keyup', () => {
    const form = new FormData();
    const previousPath = document.querySelector('#breadcrumb').dataset.path;
    form.file = searchInput.value;

    if (searchInput.value.length) {
        optionsButton.classList.add('d-none')
        axios({
            method: 'POST',
            url: 'src/php/searchFile.php',
            data: {
                form
            }
        }).then((response) => {
            document.querySelector('#folderDisplay').innerHTML = '';
            document.querySelector('#archiveDisplay').innerHTML = '';

            printBreadcrumb('../../root');
            printFolder(response.data);
        });
    } else {
        optionsButton.classList.remove('d-none')
        requestContent(previousPath);
    }

})

function removeFile(path) {
    const form = new FormData();
    form.path = path;

    axios({
        method: 'POST',
        url: 'src/php/removeFile.php',
        data: {
            form
        }
    }).then((response) => {
        if (response.data) requestContent(document.querySelector('#breadcrumb').dataset.path);
    });
}

function renameFile(path, name) {
    const form = new FormData();
    form.path = path;
    form.name = name;

    axios({
        method: 'POST',
        url: 'src/php/renameFile.php',
        data: {
            form
        }
    }).then((response) => {
        if (response.data) requestContent(document.querySelector('#breadcrumb').dataset.path);
    });
}

function uploadFile(file) {
    const form = new FormData();
    const targetPath = document.querySelector('#breadcrumb').dataset.path;
    const newPath = targetPath.replace(/\//g, '~');

    form.append("file", file, file.name, );
    form.append("path", file, newPath);

    axios({
            method: 'post',
            url: 'src/php/uploadFile.php',
            data: form,
            targetPath,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(function (response) {
            //handle success
            if (response.data === 'sizeExceed') alert('File too big!')
            requestContent(targetPath);
        })
        .catch(function (response) {
            //handle error
            console.log('response');
        });
}

function showPreview(path) {
    // const form = new FormData();

    // form.path = path;

    // axios({
    //     method: 'POST',
    //     url: 'src/php/showPreview.php',
    //     data: {
    //         form
    //     }
    // }).then((response) => {
    //     console.log(response.data)
    // });
    // console.log(path)
    document.querySelector('#iframepdf').src = path;
}