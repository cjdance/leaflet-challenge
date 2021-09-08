var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function createMap(earthquakes) {

    
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
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
  
    
    var baseMaps = {
      "Light Map": lightmap,
      "Dark Map": darkmap
    };
  
    
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [lightmap, earthquakes]
    });

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

    return div;
    };

    legend.addTo(myMap);
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);


}



d3.json(url).then(function(data) {
    createFeatures(data.features);
    console.log(data);
  });

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.title +
        "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>" +
        "<p>Depth: " + feature.geometry.coordinates[2] + "km</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: markerStyle,
        onEachFeature: onEachFeature
});

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

  


  function markerColor(depth) {
      switch (true) {
            case depth < 10:
                return "#28B463";
            case (10 <= depth && depth < 30):
                return "#DAFF33";
            case (30 <= depth && depth < 50):
                return "#FAD7A0";
            case (50 <= depth && depth < 70):
                return "#F5B041";
            case (70 <= depth && depth < 90):
                return "#DC7633";
            case depth >= 90:
                return "#C0392B";
      }
  }

  function markerRadius(magnitude) {
      return magnitude * 4 + 1;
  }

  function markerStyle(feature) {
      return {
          fillOpacity: 1,
          fillColor: markerColor(feature.geometry.coordinates[2]),
          color: "#000000",
          stroke: true,
          weight: 0.5,
          radius: markerRadius(feature.properties.mag)
      };
  }

