let map = L.map('map').setView([15.5527, 48.5164], 6);

// Define the two tile layers
const voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 19
});

const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors',
  maxZoom: 19
});

// Add the default layer (Voyager)
voyager.addTo(map);

// Group the layers for switching
const baseMaps = {
  "English Map (CartoDB Voyager)": voyager,
  "Original Map (OpenStreetMap)": openStreetMap
};

// Add the layer control to the map
L.control.layers(baseMaps).addTo(map);

async function searchFamily() {
  const familyName = document.getElementById('searchInput').value.trim();
  if (!familyName) {
    alert('Please enter a family name.');
    return;
  }

  try {
    const response = await fetch(`/search?family=${encodeURIComponent(familyName)}`);
    const familyResult = await response.json();

    if (!familyResult.length) {
      alert('No matching family found.');
      return;
    }

  clearMarkers();
  
  familyResult.forEach(record => {
    L.marker([record.lat, record.lng]).addTo(map)
       .bindPopup(`<strong>${record.family}</strong><br>City: ${record.city}`)
       .openPopup();
  });
  
  const first = familyResult[0];
  map.setView([first.lat, first.lng], 7);

  } catch (error) {
    console.error('Search error:', error);
    alert('Something went wrong while searching. Please try again later.');
    }
}

function clearMarkers() {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}

const familyNames = [
    "Kafe (קאפח)", "Shiheb (שחב-שבח)", "Eraki (עראקי)", "Salumi (סלומי-שלומי)",
    "Afgin (עפג'ין)", "Uzeyri (עזירי-עוזרי)"
    // Add more families here if you like
  ];
  
  // Initialize Fuse.js
  const fuse = new Fuse(familyNames, {
    includeScore: true,
    threshold: 0.4  // Lower = stricter matching
  });
  
const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.createElement('div');
suggestionsBox.classList.add('suggestions');
searchInput.parentNode.style.position = 'relative';  // Make parent relative
searchInput.parentNode.appendChild(suggestionsBox);

searchInput.addEventListener('input', () => {
  const value = searchInput.value.trim();
  suggestionsBox.innerHTML = '';

  if (!value) return;

  const results = fuse.search(value);

  results.forEach(result => {
    const option = document.createElement('div');
    option.textContent = result.item;
    option.onclick = () => {
      searchInput.value = result.item;
      suggestionsBox.innerHTML = '';
    };
    suggestionsBox.appendChild(option);
  });
});

L.control.logo = function (opts) {
    return new L.Control.Logo(opts);
  };

L.Control.Logo = L.Control.extend({
    onAdd: function () {
        const div = L.DomUtil.create('div', 'custom-logo');
        div.innerHTML = `
        <img src="logo.png" alt="Logo" style="height: 40px; vertical-align: middle;">
        <span style="margin-left: 8px; font-weight: bold; color: #333;">Shevach</span>
        `;
        return div;
    },

    onRemove: function () {
        // Nothing to clean up
    }
});

L.control.logo({ position: 'bottomleft' }).addTo(map);