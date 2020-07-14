// function Directory (content){
//     this.type = 'folder';
//     this.content = content;
//     this.size = getFolderSize(this.content);
// }

// function getFolderSize(content){
//     return 100;
// }

axios({
    method: 'get',
    url: 'src/php/searchdir.php',
}).then((response)=>iterateFolders(response.data));


function iterateFolders(folder, parent){
    // document.querySelector('#sideMenu').innerHTML = '';
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

                // li2.innerHTML = `
                // <ul class="collapse" id="${newId}" data-father="${folder[e].path}"></ul>
                // `
                li2.id = newId;
                li2.className = 'collapse';
                li2.innerHTML = `
                <ul data-father="${folder[e].path}"></ul>
                `
                document.querySelector('#sideMenu').append(li);
                if(hasContent) document.querySelector('#sideMenu').append(li2);
            }else{
                let li3 = document.createElement('li');
                li3.dataset['test'] = newId;

                if(hasContent){
                    li.className = `nav-item dropdwon pl-4`;
                    li.innerHTML = `
                        <a class="nav-link" data-path="${folder[e].path}" ${(hasContent) ? ' data-toggle="collapse" href="#' + newId + '" role="button" aria-expanded="false" aria-controls="'+ newId +'"' : 'href="#"'}>${folder[e].name}</a>
                    `;

                    li3.id = newId;
                    li3.className = 'collapse';
                    // li3.innerHTML = `
                    // <ul class="collapse" id="${newId}" data-father="${folder[e].path}"></ul>
                    // `
                    li3.innerHTML = `
                    <ul data-father="${folder[e].path}"></ul>
                    `
                    document.querySelector(`[data-father="${parent}"]`).append(li);
                    document.querySelector(`[data-father="${parent}"]`).append(li3);
                    // document.querySelector('#sideMenu').append(li3);
                }else{
                    li3.className = 'dropdown-item pl-5';
                    li3.innerHTML = `<a class="nav-link" data-path="${folder[e].path}" href="#">${folder[e].name}</a>`;
                    // li3.dataset['path'] = folder[e].path;
                    document.querySelector(`[data-father="${parent}"]`).append(li3);
                }
            }
            iterateFolders(folder[e].content, folder[e].path);
        }else{
            //console.log(folder[e].name);
        }
        // let folder = new Directory(folder[e]);
    });
}
