let currentScore = 0;
let map;
let currentCountryLayer = null;
let countriesGeoJSON;

// Inițializează harta
// Inițializează harta
function initMap() {
    map = L.map('map').setView([54.5, 15.0], 4);

    // Hartă fără etichete - doar contururi
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19
    }).addTo(map);

    // Încarcă datele GeoJSON pentru țările Europei
    loadEuropeCountries();
}

// Încarcă țările Europei
function loadEuropeCountries() {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(data => {
            countriesGeoJSON = data;
            displayCountries();
            loadCountry();
        });
}

// Afișează toate țările
function displayCountries() {
    L.geoJSON(countriesGeoJSON, {
        style: {
            fillColor: '#95a5a6',
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        },
        onEachFeature: function(feature, layer) {
            layer.on('click', function() {
                checkCountryClick(feature.properties.name);
            });

            layer.on('mouseover', function() {
                this.setStyle({
                    fillColor: '#3498db',
                    fillOpacity: 0.9
                });
            });

            layer.on('mouseout', function() {
                this.setStyle({
                    fillColor: '#95a5a6',
                    fillOpacity: 0.7
                });
            });
        }
    }).addTo(map);
}

// Verifică click pe țară
function checkCountryClick(countryName) {
    const targetCountry = document.getElementById('country-name').textContent;

    fetch('/check-answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: countryName })
    })
    .then(response => response.json())
    .then(data => {
        const feedback = document.getElementById('feedback');

        if (data.correct) {
            feedback.textContent = '✓ Correct! +1 point';
            feedback.className = 'correct';
            currentScore = data.score;
            document.getElementById('score').textContent = currentScore;
        } else {
            feedback.textContent = `✗ Wrong! The correct answer was: ${data.correct_answer}`;
            feedback.className = 'incorrect';
        }

        document.getElementById('next-btn').style.display = 'block';
    });
}

// Încarcă o țară nouă
function loadCountry() {
    fetch('/get-country')
        .then(response => response.json())
        .then(data => {
            document.getElementById('country-name').textContent = data.country;
            document.getElementById('feedback').textContent = '';
            document.getElementById('feedback').className = '';
            document.getElementById('next-btn').style.display = 'none';
        });
}

// Actualizează scorul
function updateScore() {
    fetch('/get-score')
        .then(response => response.json())
        .then(data => {
            document.getElementById('score').textContent = data.score;
        });
}

// Next button
document.getElementById('next-btn').addEventListener('click', loadCountry);

// Inițializare când pagina se încarcă
window.onload = function() {
    initMap();
    updateScore();
};