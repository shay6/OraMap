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
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const response = await fetch(`/search?family=${encodeURIComponent(query)}`);
  const results = await response.json();

  clearMarkers();

  if (results.length === 0) {
    alert('No families found.');
    return;
  }

  results.forEach(fam => {
    L.marker([fam.lat, fam.lng]).addTo(map)
      .bindPopup(`<b>${fam.family}</b><br>${fam.city}`)
      .openPopup();
  });
}

async function viewAllFamilies() {
  const response = await fetch(`/search?family=`);
  const results = await response.json();

  clearMarkers();

  results.forEach(fam => {
    L.marker([fam.lat, fam.lng]).addTo(map)
      .bindPopup(`<b>${fam.family}</b><br>${fam.city}`);
  });
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
    "Afgin (עפג'ין)", "Al-Maqtari",
    "Al-Attas", "Al-Saqqaf"
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
