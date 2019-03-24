const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const select = document.getElementById("cryptoPicker");

fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'X-CMC_PRO_API_KEY': '6529d989-ac88-401e-88ad-343c34478107'
        }
    }).then(res => res.json())
    .then(cmcResponse => console.log(cmcResponse))
    .catch(err => console.error(err));


function initPicker(coinlist) {
    for (let entry of coinlist.data) {
        console.log(entry.name);
        let el = document.createElement('option');
        el.textContent = entry.name;
        select.appendChild(el);
    }
}

// const select = document.getElementById("cryptoPicker"); 
// var options = ["1", "2", "3", "4", "5"]; 

// for(var i = 0; i < options.length; i++) {
//     var opt = options[i];
//     var el = document.createElement("option");
//     el.textContent = opt;
//     el.value = opt;
//     select.appendChild(el);
// }​