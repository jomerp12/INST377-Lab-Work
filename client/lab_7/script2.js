/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable space-before-blocks */
function toggleSpanVisibility(evt) {
    // console.log('Clicked primary button', evt.target);
    const button = evt.target;
    const target = document.querySelector('#demo_box');
    console.log(target.classList);
    if (target.classList.value.includes('visible')) {
        console.log('found item');
        target.classList.remove('visible');
        target.classList.add('hidden');
    } else {
        target.classList.remove('hidden');
        target.classList.add('visible');
    }
}

async function fetchRequest(url) {
    try {
        const request = await fetch(url);
        const json = await request.json();
        //console.table(json);
        return json;
    } catch (err) {
        console.error(err);
        return err;
    }
}

async function mainThread() {
    console.log('loaded main script');
    const url = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
    const inputBox = document.querySelector('#zipcode');
    const visibleListOfFilteredItems = document.querySelector('.append-box');
    const ACCESSTOKEN = 'pk.eyJ1Ijoiam9tZXJwMTIiLCJhIjoiY2t1c202bTM2MHhsczJ1cGpmOXBpNm44ZyJ9.1gniEHvCPZn2FGwpvm0i2w';

    //LeafLet Map
    const mymap = L.map('mapid').setView([38.989, -76.93], 12);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoiam9tZXJwMTIiLCJhIjoiY2t1c202bTM2MHhsczJ1cGpmOXBpNm44ZyJ9.1gniEHvCPZn2FGwpvm0i2w'
    }).addTo(mymap);

    const targetElement = document.querySelector('.click_demo');
    targetElement.addEventListener('click', (event) => toggleSpanVisibility(event));

    const data = await fetchRequest(url);
    console.log('external dataset', data);

    inputBox.addEventListener('input', (event) => {
        console.log(event.target, value);
        const filteredList = data.filter((item, index) => {
            const zipcode = event.target.value;
            return item.zip === zipcode;
        });
        console.table(filteredList);
        filteredList.forEach((item, index) => {
            visibleListOfFilteredItems.innerHTML += `<span class="resto-name">${item.name}</span><br>`;
        });
    });
}

window.onload = mainThread;