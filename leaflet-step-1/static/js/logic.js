var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data) {
    createFeatures(data.features);
    console.log(data);
  });

  function createFeatures(earthquakeData) {


    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.title +
        "</h3><hr><p>Type: " + feature.properties.type + "</p>" +
        "<p>Magnitude: " + feature.properties.mag + "</p>" + 
        "<p>Depth: " + feature.geometry.coordinates[2] + "km<p>");
    }
  
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

  function createMap(earthquakes) {

    
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: "pk.eyJ1IjoiY2pkYW5jZSIsImEiOiJja3Nwc2ZlbzQwNmFjMm9sbXBpbGVzMm5hIn0.k9TiZqLFLEGGZRvvk5TRFw"
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: "pk.eyJ1IjoiY2pkYW5jZSIsImEiOiJja3Nwc2ZlbzQwNmFjMm9sbXBpbGVzMm5hIn0.k9TiZqLFLEGGZRvvk5TRFw"
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }


  function markerColor(depth) {
      switch (true) {
            case depth < 10:
                return "green";
            case (10 <= depth & depth < 30):
                return "yellow";
            case (30 <= depth & depth < 50):
                return "orange";
            case (50 <= depth & depth < 70):
                return "palered";
            case (70 <= depth & depth < 90):
                return "red";
            case depth >= 90:
                return "black";
      }
  }