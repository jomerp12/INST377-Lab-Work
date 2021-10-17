/* eslint-disable spaced-comment */
/* eslint-disable no-var */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
async function dataHandler() {
    const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

    const request = await fetch(endpoint);
    const json = await request.json();
    const inputBox = document.querySelector('#zipcode');
    const visibleListOfFilteredItems = document.querySelector('.append-box');

    function findMatches(wordToMatch, json) {
        return json.filter(place => {
            const zipcode = event.target.value;
            return place.zip.match(zipcode)
        });
    }

    /* function filterFunction(event, data, list) {
        const filteredList = data.filter((item, index) => {
            const zipcode = event.target.value;
            return item.zip === zipcode;
        });
        console.table(filteredList);
    } */

    function displayMatches() {
        const matchArray = findMatches(event.target.value, json);
        const matchArrayFive = matchArray.slice(0, 5);

        matchArrayFive.forEach((item, index) => {
            const point = item.geocoded_column_1;
            const latLong = point.coordinates;
            const marker = latLong.reverse();

            matchArrayFive.innerHTML += `<span class="resto-name">${item.name}</span><br>`;

        });

        const html = matchArrayFive.map(place => {
            const regex = new RegExp(event.target.value, 'gi');
            const restaurantName = place.name.replace(regex, `<span class="hl">${event.target.value}</span>`);
            const addressLine = place.address_line_1.replace(regex, `<span class="hl">${event.target.value}</span>`);
            return `
        <li>
        <br>
        <span class="name">${restaurantName}</span>
        <br>
        <span class="name">${addressLine}</span>
        <br>
        </li>
        `
        }).join('');
        suggestions.innerHTML = html;
    }

    const searchInput = document.querySelector('.search');
    const suggestions = document.querySelector('.suggestions');

    searchInput.addEventListener('change', displayMatches);
    searchInput.addEventListener('keyup', (evt) => {
        dataHandler(evt)
    });
    searchInput.addEventListener('keyup', (evt) => {
        displayMatches(evt)
    });
}

function mapInit() {
    //Leaflet Map
    const mymap = L.map('mapid').setView([38.989, -76.93], 12);
    var marker = L.marker([51.5, -0.09]).addTo(mymap);
    var circle = L.circle([51.508, -0.11], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(mymap);
    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(mymap);
    var popup = L.popup();

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoiam9tZXJwMTIiLCJhIjoiY2t1c202bTM2MHhsczJ1cGpmOXBpNm44ZyJ9.1gniEHvCPZn2FGwpvm0i2w'
    }).addTo(mymap);

    /*     function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent('You clicked the map at ' + e.latlng.toString())
                .openOn(mymap);
        } */

    //mymap.on('click', onMapClick);
}

window.onload = dataHandler();
window.onload = mapInit;