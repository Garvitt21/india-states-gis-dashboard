const geojsonPath = "./Indian_States"; // use your exact filename here

const populations = {
  "Andaman and Nicobar": 380581,
  "Andhra Pradesh": 49386799,
  "Arunachal Pradesh": 1383727,
  "Assam": 31205576,
  "Bihar": 104099452,
  "Chandigarh": 1055450,
  "Chhattisgarh": 25545198,
  "Dadra and Nagar Haveli": 343709,
  "Daman and Diu": 243247,
  "Delhi": 16787941,
  "Goa": 1458545,
  "Gujarat": 60439692,
  "Haryana": 25353081,
  "Himachal Pradesh": 6864602,
  "Jammu and Kashmir": 12541302,
  "Jharkhand": 32988134,
  "Karnataka": 61095297,
  "Kerala": 33406061,
  "Lakshadweep": 64473,
  "Ladakh": 274289,
  "Madhya Pradesh": 72626809,
  "Maharashtra": 112374333,
  "Manipur": 2855794,
  "Meghalaya": 2966889,
  "Mizoram": 1097206,
  "Nagaland": 1978502,
  "Odisha": 41974218,
  "Puducherry": 1247953,
  "Punjab": 27743338,
  "Rajasthan": 68548437,
  "Sikkim": 610577,
  "Tamil Nadu": 72147030,
  "Telangana": 35193978,
  "Tripura": 3673917,
  "Uttar Pradesh": 199812341,
  "Uttarakhand": 10086292,
  "West Bengal": 91276115
};

let map, geojsonLayer, stateFeatures = [], highlight;

window.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView([23.2, 79.2], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  fetch(geojsonPath)
    .then((r) => r.json())
    .then((data) => {
      stateFeatures = data.features;

      geojsonLayer = L.geoJSON(data, {
        style: {
          color: "#3388ff",
          weight: 1,
          fillOpacity: 0.15,
        },
        onEachFeature: (feature, layer) => {
          const name = feature.properties.NAME_1;
          const pop = populations[name] ?? "—";
          layer.bindPopup(`<strong>${name}</strong><br/>Population: ${format(pop)}`);
        },
      }).addTo(map);

      updateSidebar();
    });

  document.getElementById("searchForm").addEventListener("submit", handleSearch);
});

function updateSidebar(selectedFeature) {
  const stats = document.getElementById("stats");
  stats.innerHTML = "";

  stats.insertAdjacentHTML(
    "beforeend",
    `<p><strong>Total States & UTs:</strong> ${stateFeatures.length}</p>`
  );

  const random = pickRandom(stateFeatures, 5).map((f) => f.properties.NAME_1);
  stats.insertAdjacentHTML(
    "beforeend",
    `<p><strong>Random 5:</strong> ${random.join(", ")}</p>`
  );

  if (selectedFeature) {
    const name = selectedFeature.properties.NAME_1;
    const pop = populations[name] ?? "—";
    stats.insertAdjacentHTML(
      "beforeend",
      `<hr class="my-2" />
       <h2 class="font-semibold">Selected State / UT</h2>
       <p>Name: ${name}</p>
       <p>Population: ${format(pop)}</p>`
    );
  }
}

function handleSearch(e) {
  e.preventDefault();
  const query = document.getElementById("stateInput").value.trim().toLowerCase();

  if (highlight) {
    map.removeLayer(highlight);
    highlight = null;
  }

  const feature = stateFeatures.find(
    (f) => f.properties.NAME_1.toLowerCase() === query
  );

  if (!feature) {
    alert("State/UT not found. Check the spelling!");
    return;
  }

  highlight = L.geoJSON(feature, {
    style: { color: "#ff5733", weight: 2, fillOpacity: 0.3 },
  }).addTo(map);
  map.fitBounds(highlight.getBounds());

  updateSidebar(feature);
}

function pickRandom(arr, n) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

function format(x) {
  return typeof x === "number" ? x.toLocaleString("en-IN") : x;
}
