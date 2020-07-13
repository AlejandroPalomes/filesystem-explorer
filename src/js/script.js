// const axios = require('axios').default;
// require('bootstrap');


var oReq = new XMLHttpRequest();

oReq.onload = function () {
    reqListener(JSON.parse(this.responseText));
};

oReq.open("get", "src/php/navdir.php", true);

oReq.send();

let sideMenu = document.querySelector('#sideMenu');

function reqListener(a) {
    console.log(a)
    let array = Object.keys(a);
    array.forEach(e => {
        if(!(e=='0')){
            console.log(typeof e)
            let li = document.createElement('li');
            li.textContent = a.e;

            sideMenu.appendChild(li);
        }
    });
}