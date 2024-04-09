// Function to fetch JSON data
let jsonData 
//console.log("js is loaded")
function fetchJSONData() {
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';
  //console.log("fetch json data")
return d3.json(url)
  
}

// Create a map centered around the world
var map = L.map('map').setView([0, 0], 2);

// Add the OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define a function to calculate marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 5; // Adjust multiplier for desired marker size
}

// Define a function to calculate marker color based on depth
function getMarkerColor(depth) {
    // color scale
    return depth > 300 ? '#800026' :
           depth > 200 ? '#BD0026' :
           depth > 100 ? '#E31A1C' :
           '#FC4E2A';
}

// Loading the earthquake data from the provided JSON URL
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson')
    .then(response => response.json())
    .then(data => {
        // Iterating over each earthquake feature with a marker on the map
        data.features.forEach(feature => {
            var coords = feature.geometry.coordinates;
            var magnitude = feature.properties.mag;
            var depth = coords[2];
            var marker = L.circleMarker([coords[1], coords[0]], {
                radius: getMarkerSize(magnitude),
                fillColor: getMarkerColor(depth),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            // popup to display additional information about the earthquake
            marker.bindPopup(`
                <b>Location:</b> ${feature.properties.place}<br>
                <b>Magnitude:</b> ${magnitude}<br>
                <b>Depth:</b> ${depth} km
            `);
        });

        // Creating a Legend
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            var depths = [0, 100, 200, 300];
            div.innerHTML += '<b>Depth (km)</b><br>';
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getMarkerColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
            }
            return div;
        };
        legend.addTo(map);
    });
