loadSideMenu();
requestContent('../../root');

const options = document.querySelectorAll('.rClickOption');
const contextMenu = document.querySelector('#rightClick');
const renameBtn = document.querySelector('#renameConfirmBtn');
const renameInp = document.querySelector('#renameInput');

document.querySelector('body').addEventListener('click', e=>{if(!e.target.classList.contains('rClickOption')) contextMenu.classList.add('d-none')});
renameBtn.addEventListener('click', e=>{
    renameFile(e.target.dataset.path, renameInp.value);
    $('#renameFile').modal('hide');
})

options.forEach(option=>{
    option.addEventListener('click', e=>{
        switch (e.target.innerText) {
            case 'Remove': removeFile(e.currentTarget.dataset.path); contextMenu.classList.add('d-none'); break;
            case 'Rename': $('#renameFile').modal('show'); renameBtn.dataset.path = e.currentTarget.dataset.path; contextMenu.classList.add('d-none'); break;
            default: contextMenu.classList.add('d-none'); break;
        }
    })
})


function loadSideMenu(){
    axios({
    method: 'get',
    url: 'src/php/searchdir.php',
    }).then((response)=>{
        document.querySelector('#sideMenu').innerHTML = '';
        iterateFolders(response.data);
        document.querySelectorAll('#sideMenu [data-path]').forEach(e=>{
            e.addEventListener('click', link=> requestContent(link.target, false));
        });
    });
}
function iterateFolders(folder, parent){
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

function requestContent(folder, init = true){
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
    }).then((response)=>{
        document.querySelector('#infoPreview-img').src = 'src/img/icons/' + checkImgSrc(response.data.type);
        document.querySelector('#infoBody-name').innerText = response.data.name;
        document.querySelector('#infoBody-type').innerText = response.data.type;
        document.querySelector('#infoBody-mtime').innerText = response.data.mtime;
        let totalSize;
        if(response.data.size < 1000) totalSize = response.data.size + ' bytes';
        if(response.data.size > 1000 && response.data.size < 100000) totalSize = (Math.round(response.data.size/1000*10)/10) + 'KB';
        if(response.data.size > 100000 && response.data.size < 100000000) totalSize = (Math.round(response.data.size/1000000*10)/10) + 'MB';
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

        (folder[e].type === 'directory') ? document.querySelector('#folderDisplay').append(div) : document.querySelector('#archiveDisplay').append(div);
    });
    addListeners();
}

function addListeners(){
    const files = document.querySelectorAll('#fileDisplay .card');
    files.forEach( file=>{
        file.addEventListener('dblclick', (e)=>{
            const file = e.currentTarget.querySelector('img');
            if(file.src.includes('src/img/icons/folder.png')){
                requestContent(e.currentTarget.dataset.path)
            }else{
                $('#mediaPlayer').modal('show');
                document.querySelector('#mediaPlayerTitle').innerText = e.currentTarget.querySelector('h5').innerText;
                let playFile = null;
                let fileType = e.currentTarget.dataset.type.toLowerCase();
                if(fileType == 'mp3') playFile = document.querySelector('#audioTag');
                if(fileType == 'mp4') playFile = document.querySelector('#videoTag');
                if(fileType == 'pdf') showPreview(e.currentTarget.dataset.path);
                if(fileType == 'jpg' || fileType == 'jpeg' ||
                fileType == 'svg' || fileType == 'png'){
                    document.querySelector('#imgTag').src = e.currentTarget.dataset.path;
                    document.querySelector('#imgTag').classList.remove('d-none');
                }else{
                    playFile.classList.remove('d-none')
                    playFile.src = e.currentTarget.dataset.path;
                    playFile.play();
                }

                $('#mediaPlayer').on('hidden.bs.modal', function (e) {
                    document.querySelector('#imgTag').classList.add('d-none');
                    if(playFile !== null){
                        playFile.classList.add('d-none')
                        playFile.pause();
                    }
                })
            }
        });
        file.addEventListener('click', (e)=>requestFileInfo(e.currentTarget.dataset.path));
        file.addEventListener('contextmenu', (e)=>{
            e.preventDefault();

            contextMenu.classList.remove('d-none');
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';

            options.forEach(option=>{
                option.dataset.path = e.currentTarget.dataset.path;
            })

        });
    });
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
    liElements.forEach((e, i)=>{
        if(i+1 < liElements.length){
            e.addEventListener('click', e=>{
                requestContent(e.target, false)
            })
        }
    });
}

function checkImgSrc(type){
    let finalPath = '';

    switch (type) {
        case 'directory': finalPath = 'folder.png'; break;
        case 'PNG':
        case 'png': finalPath = 'png.png'; break;
        case 'jpg':
        case 'JPG':
        case 'JPEG':
        case 'jpeg': finalPath = 'jpg.png'; break;
        case 'svg+xml':
        case 'svg': finalPath = 'svg.png'; break;
        case 'docx':
        case 'doc': finalPath = 'doc.png'; break;
        case 'ppt':
        case 'pptx': finalPath = 'ppt.png'; break;
        case 'odt': finalPath = 'odt.png'; break;
        case 'zip': finalPath = 'zip.png'; break;
        case 'mp3':
        case 'mpeg': finalPath = 'mp3.png'; break;
        case 'mp4': finalPath = 'mp4.png'; break;
        case 'rar': finalPath = 'rar.png'; break;
        case 'pdf': finalPath = 'pdf.png'; break;
        case 'csv': finalPath = 'csv.png'; break;
        case 'txt': finalPath = 'txt.png'; break;
        case 'exe': finalPath = 'exe.png'; break;

        default: finalPath = 'unknown.png'; break;
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
        // console.log(response.data);
        // console.log(folderPath + '/' + folderName);
        if(response.data == folderPath + '/' + folderName){
            requestContent(document.querySelector('#breadcrumb'));
            //amagar el modal
        }else{
            //posar missatge al modal de error
            alert('Failed to create');
        }
    });
}

//Submit Form
function submitFolder() {
    document.getElementById('folderPath').value = document.querySelector('#breadcrumb').dataset.path;
    document.querySelector('#createFolderForm').submit();
}

const optionsBtn = document.querySelector('#optionsButton');
optionsBtn.addEventListener('click', createFolder);

const searchInput = document.querySelector('#searchFolder');
searchInput.addEventListener('keyup', ()=>{
    const form = new FormData();
    const previousPath = document.querySelector('#breadcrumb').dataset.path;
    form.file = searchInput.value;
    
    if(searchInput.value.length){
        optionsButton.classList.add('d-none')
        axios({
            method: 'POST',
            url: 'src/php/searchFile.php',
            data: {
                form
            }
        }).then((response)=>{
            document.querySelector('#folderDisplay').innerHTML = '';
            document.querySelector('#archiveDisplay').innerHTML = '';

            printBreadcrumb('../../root');
            printFolder(response.data);
        });
    }else{
        optionsButton.classList.remove('d-none')
        requestContent(previousPath);
    }

})

function removeFile(path){
    const form = new FormData();
    form.path = path;

    axios({
        method: 'POST',
        url: 'src/php/removeFile.php',
        data: {
            form
        }
    }).then((response)=>{
        if(response.data) requestContent(document.querySelector('#breadcrumb').dataset.path);
    });
}

function renameFile(path, name){
    const form = new FormData();
    form.path = path;
    form.name = name;

    axios({
        method: 'POST',
        url: 'src/php/renameFile.php',
        data: {
            form
        }
    }).then((response)=>{
        if(response.data) requestContent(document.querySelector('#breadcrumb').dataset.path);
    });
}

function showPreview(path){
    const form = new FormData();

    form.path = path;

    axios({
        method: 'POST',
        url: 'src/php/showPreview.php',
        data: {
            form
        }
    }).then((response)=>{
        console.log(response.data)
    });
}
