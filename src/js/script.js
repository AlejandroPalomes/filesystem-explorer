
axios({
    method: 'get',
    url: 'src/php/searchdir.php',
}).then((response)=>{
    document.querySelector('#sideMenu').innerHTML = '';
    iterateFolders(response.data);
    document.querySelectorAll('[data-path]').forEach(e=>{
        e.addEventListener('click', link=> requestContent(link.target));
    });
});

function iterateFolders(folder, parent){
    let key = Object.keys(folder);
    key.forEach(e => {
        if(folder[e].type === 'directory'){
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

            if(!parent){
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
                if(hasContent) document.querySelector('#sideMenu').append(li2);
            }else{
                let li3 = document.createElement('li');
                li3.dataset['test'] = newId;

                if(hasContent){
                    li.className = `nav-item dropdwon`;
                    li.innerHTML = `
                        <a class="nav-link" data-path="${folder[e].path}" ${(hasContent) ? ' data-toggle="collapse" href="#' + newId + '" role="button" aria-expanded="false" aria-controls="'+ newId +'"' : 'href="#"'}>${folder[e].name}</a>
                    `;

                    li3.id = newId;
                    li3.className = 'collapse';
                    li3.innerHTML = `<ul class="ml-4" data-father="${folder[e].path}"></ul>`
                    document.querySelector(`[data-father="${parent}"]`).append(li);
                    document.querySelector(`[data-father="${parent}"]`).append(li3);
                }else{
                    li3.innerHTML = `<a class="nav-link" data-path="${folder[e].path}" href="#">${folder[e].name}</a>`;
                    document.querySelector(`[data-father="${parent}"]`).append(li3);
                }
            }
            iterateFolders(folder[e].content, folder[e].path);
        }else{
            //console.log(folder[e].name);
        }
    });
}

function requestContent(folder){
    const form = new FormData();

    form.path = folder.dataset.path;

    axios({
        method: 'POST',
        url: 'src/php/printFolder.php',
        data:{
            form
        }
    }).then((response)=>{
        document.querySelector('#folderDisplay').innerHTML = '';
        document.querySelector('#archiveDisplay').innerHTML = '';
        document.querySelector('#breadcrumb').dataset.fullPath = folder.dataset.path;
        printBreadcrumb(folder.dataset.path);
        printFolder(response.data);
    });
}

function requestFileInfo(path){
    const form = new FormData();

    form.path = path;

    axios({
        method: 'POST',
        url: 'src/php/fileInfo.php',
        data:{
            form
        }
    }).then((response)=>{
        // document.querySelector('#folderDisplay').innerHTML = '';
        // document.querySelector('#archiveDisplay').innerHTML = '';
        // document.querySelector('#breadcrumb').dataset.fullPath = folder.dataset.path;
        console.log(response.data)
        
    });
}


function printFolder(folder){
    let key = Object.keys(folder);
    key.forEach(e => {
        // console.log(e)
        // console.log(folder[e].type);
        const div = document.createElement('div');
        div.className = 'card m-2 d-flex justify-content-center';
        div.dataset.path = folder[e].path;
        let imgPath = '';
        let imgSize = '';

        switch (folder[e].type) {
            case 'directory': imgPath = 'folder.png'; break;
            case 'image/png': imgPath = 'png.png'; break;
            case 'image/jpg':
            case 'image/jpeg': imgPath = 'jpg.png'; break;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': imgPath = 'doc.png'; break;
            case 'application/zip': imgPath = 'zip.png'; break;
            case 'audio/mp3':
            case 'audio/mpeg': imgPath = 'mp3.png'; break;

            default: imgPath = 'unknown.png'; break;
        }

        div.innerHTML = `
            <img class="mx-auto mt-2" src="src/img/icons/${imgPath}" height="65px" alt="Card image cap">
            <div class="card-body mx-auto mt-2">
                <h5 class="card-title">${folder[e].name}</h5>
            </div>
        `;

        // document.querySelector('#folderDisplay').append(div);
        (folder[e].type === 'directory') ? document.querySelector('#folderDisplay').append(div) : document.querySelector('#archiveDisplay').append(div);
    });

    const files = document.querySelectorAll('#fileDisplay .card');
    files.forEach( e=>{
        e.addEventListener('dblclick', ()=>console.log('ho'));
        e.addEventListener('click', (e)=>requestFileInfo(e.currentTarget.dataset.path));
    });
}

function printBreadcrumb(path){
    const elements = path.replace('/', '').replace(/\./g, '').replace('/', '').split('/');
    const breadcrumb = document.querySelector('#breadcrumb-ol');
    let relativePath = '../..'
    breadcrumb.innerHTML = '';

    elements.forEach((e, i)=>{
        const li = document.createElement('li');
        relativePath += ('/' + e);
        li.className = 'breadcrumb-item';
        if(i+1 != elements.length) li.classList.add('breadcrumb__link');
        li.dataset.path =relativePath;
        li.textContent = e;

        breadcrumb.append(li);
    })

    const liElements = document.querySelectorAll('#breadcrumb-ol li');
    liElements.forEach((e, i)=>{
        if(i+1 < liElements.length){
            e.addEventListener('click', e=>{
                requestContent(e.target)
            })
        }
    });
}