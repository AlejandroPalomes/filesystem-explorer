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
    url: 'src/php/navdir.php',
}).then(function (response) {
    console.log(response.data)
    let key = Object.keys(response.data);
    key.forEach(element => {
        let folder = new Directory(response.data[element]);
        // console.log(folder)
    });
});