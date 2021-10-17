/* eslint-disable spaced-comment */
/* eslint-disable no-var */
/* eslint-disable linebreak-style */
/* eslint-disable indent */

async function dataHandler() {
    const endpoint =
        'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
    const request = await fetch(endpoint);
    const arrayName = await request.json();
    let markerGroup;

    function findMatches(wordToMatch, arrayName) {
        const regex = new RegExp(wordToMatch, 'gi');
        const matchArrayFive = arrayName.reduce((acc, cur) => {
            const tempArray = acc.find(
                (item) => item.establishment_id === cur.establishment_id
            )
            if (!tempArray &&
                cur.geocoded_column_1 &&
                cur.zip.match(regex)
            ) {
                acc.push(cur);
                return acc;
            }
            return acc;
        }, []);
        return matchArrayFive.slice(0, 5);
    }

    function displayMatches(event) {
        const matchArray = findMatches(
            event.target.elements.search.value,
            arrayName
        );
        const html = matchArray
            .map((establishment) => {
                const regex = new RegExp(event.target.elements.search.value, 'gi');
                const addressLine = establishment.address_line_1.replace(regex, `<span class="hl">${event.target.value}</span>`);
                return `
          <li class="list-group-item">
            <p><strong>${establishment.name}</strong></p>
            <p><i>${addressLine}</i></p>
          </li>
        `
            })
            .join('');
        suggestions.innerHTML = html;


        if (matchArray.length > 0) {
            const firstItem = matchArray[0];
            mymap.setView(
                [
                    firstItem.geocoded_column_1.coordinates[1],
                    firstItem.geocoded_column_1.coordinates[0]
                ],
                13
            );
            const markers = [];
            matchArray.forEach((establishment) => {
                const latitude = establishment.geocoded_column_1.coordinates[1];
                const longitude = establishment.geocoded_column_1.coordinates[0];
                const marker = L.marker([latitude, longitude]).addTo(mymap);
                markers.push(marker)
            });
            markerGroup = L.layerGroup(markers).addTo(mymap);
        }
    }

    const searchForm = document.querySelector('#searchForm');
    const searchInput = document.querySelector('.search');
    const suggestions = document.querySelector('.suggestions');

    searchInput.addEventListener('input', (event) => {
        if (event.target.value === '') {
            suggestions.innerHTML = '';
            console.log('no input');
            markerGroup.clearLayers();
        }
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        displayMatches(event);
    });
}

// Leaflet Map
function mapInit() {
    const mymap = L.map('mapid').setView([38.83, -76.85], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoiam9tZXJwMTIiLCJhIjoiY2t1c202bTM2MHhsczJ1cGpmOXBpNm44ZyJ9.1gniEHvCPZn2FGwpvm0i2w'
    }).addTo(mymap);
    return mymap;
}

window.onload = dataHandler();
const mymap = mapInit()