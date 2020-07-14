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


function iterateFolders(folder){
    let key = Object.keys(folder);
    key.forEach(e => {
        if(folder[e].type === 'directory'){
            //console.log(typeof folder[e].content)
            let contents;
            hasContent = false;

            if (typeof folder[e].content == 'object') contents = Object.keys(folder[e].content);
            if (contents.length) hasContent = true;

            let li = document.createElement('li');
            li.className = `nav-item ${(hasContent) ? 'dropdwon' : ''}`;
            li.innerHTML = `
                <a class="nav-link active" data-path="${folder[e].path}" ${(hasContent) ? ' data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample"' : 'href="#"'}>${folder[e].name}</a>
            `;


            document.querySelector('#sideMenu').append(li);
            iterateFolders(folder[e].content);
        }else{
            //console.log(folder[e].name);
        }
        // let folder = new Directory(folder[e]);
        // console.log(folder)
    });
}