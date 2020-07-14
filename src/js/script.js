function Directory (content){
    this.type = 'folder';
    this.content = content;
    this.size = getFolderSize(this.content);
}

function getFolderSize(content){
    return 100;
}

axios({
    method: 'get',
    url: 'src/php/searchdir.php',
}).then((response)=>iterateFolders(response.data));


function iterateFolders(folder){
    let key = Object.keys(folder);
    key.forEach(e => {
        if(folder[e].type === 'directory'){
            let li = document.createElement('li');
            li.innerHTML = `<span>${folder[e].name}</span>`;

            // li.textContent = folder[e].name;

            document.querySelector('#sideMenu').append(li);
            iterateFolders(folder[e].content);
            // console.log(folder[e].content)
        }else{
            console.log(folder[e].name);
        }
        // let folder = new Directory(folder[e]);
        // console.log(folder)
    });
}