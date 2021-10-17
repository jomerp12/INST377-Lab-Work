async function windowActions() {
    const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';


    const request = await fetch(endpoint)
    const cities = await request.json()

    async function dataHandlerfunction() {

        function findMatches(wordToMatch, cities) {
            return cities.filter(place => {
                // here we need to figure out if the city or state matches what was searched
                const regex = new RegExp(wordToMatch, 'gi');
                return place.name.match(regex) || place.category.match(regex)
            });
        }

        function displayMatches() {
            const matchArray = findMatches(event.target.value, cities);
            const html = matchArray.map(place => {
                const regex = new RegExp(event.target.value, 'gi');
                const restaurantName = place.name.replace(regex, `<span class="hl">${event.target.value}</span>`);
                const addressLine = place.address_line_1.replace(regex, `<span class="hl">${event.target.value}</span>`);
                const cityName = place.city.replace(regex, `<span class="hl">${event.target.value}</span>`);
                const stateName = place.state.replace(regex, `<span class="hl">${event.target.value}</span>`);
                const zipCode = place.zip.replace(regex, `<span class="hl">${event.target.value}</span>`);
                return `
        <li>
        <span class="name">${restaurantName}</span>
        <br>
        <span class="name">${addressLine}</span>
        <br>
        <span class="name">${cityName}, ${stateName}</span>
        <br>
        <span class="name">${zipCode}</span>
        <br>
        </li>
        `
            }).join('');
            suggestions.innerHTML = html;
        }
    }
    const searchInput = document.querySelector('.search');
    const suggestions = document.querySelector('.suggestions');

    searchInput.addEventListener('change', displayMatches);
    searchInput.addEventListener('keyup', (evt) => {
        displayMatches(evt)
    });

}
window.onload = windowActions;