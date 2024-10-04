import { MapContainer, useMap, TileLayer, Pane, GeoJSON } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import views from "../views";
import CongressionalDistrictMap from "./CongressionalDistrictMap";
import CountyMap from "./CountyMap";
import PrecinctMap from "./PrecinctMap";
import Color from "color";
import Map from "./Map";
import USA from '../geojson/usa_2.json'
// import M from "./MapViews";

const StatesMap = ( { selectedArea, setSelectedArea, mapView }) => {
    console.log({selectedArea, mapView});
    // console.log(views['both'][mapView]);
    const [display, setDisplay] = useState([mapView, views['none'][mapView.toLowerCase()]]);

    useEffect(() => {
      console.log('Display updated:', display);
    }, [display]);

    useEffect(() => {
      console.log(views[selectedArea][mapView.toLowerCase()]);
      setDisplay([mapView, views[selectedArea][mapView.toLowerCase()]]);
    }, [selectedArea, mapView]);

    /**
    * ? does the hover effect but don't know if this is the best place to show popups 
    **/
   let originalColor;

    const onEachFeature= (feature, layer)=> {
        layer.setStyle({
            fillColor: "#ff6961",
            fillOpacity: 0.5,
            color: "black",
            weight: 1,
          });
        console.log(feature);
        layer.on({
          mouseover: (e) => {
            originalColor = e.target.options.fillColor;
            const darkerColor = Color(originalColor).darken(0.2).hex(); // Darken by 20%
            e.target.setStyle({ fillColor: darkerColor });
          },
          // Mouseout event - Revert to original color
          mouseout: (e) => {
            e.target.setStyle({ fillColor: originalColor });
          },
            click: (e) => {
                // console.log(feature.p);
                setSelectedArea(feature.properties.NAME);
            }
        });
    }

    const usaBounds = [
      [24.396308, -125.0],   // Southwest corner
      [47.543285, -53.618125] // Northeast corner
    ];

    const countryBorder = (feature => {
      return ({
          fillColor: '#ffffff',
          fillOpacity: 0.5,
          color: "black",
          weight: 2,
        })
      });


  return (
    <>
    <MapContainer center={[36, -92]} zoom={5} style={{ width: '100%', zIndex: 1}} maxBounds={usaBounds} maxBoundsViscosity={1} minZoom={5} ref={mapRef}>
    <MapController selectedArea={selectedArea} mapView={mapView}/>
      {selectedArea !== 'none' && <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />}
      {selectedArea !== 'none' && <Pane name="labels" style={{ zIndex: 650 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
        />
      </Pane>}


      {/* Some type of border just around the US */}

      <GeoJSON key={'usa'} data={USA} style={countryBorder} zIndex={1}/>

      {/* Where stuff are displayed */}
      <Map display={display} onEachFeature={onEachFeature}/>


    </MapContainer>
    </>
  );
};

const MapController = ( {selectedArea, mapView }) => {
  const map = useMap();

  if(selectedArea === 'South Carolina' && mapView === 'State') {
    // console.log("map", map.getCenter());
    map.flyTo([33.5, -76], 7.5, {
        animate: true,
        duration: 1,
    });
  } else if (selectedArea === 'Utah' && mapView === 'State') {
    map.flyTo([39.7,-106], 7.25, {
        animate: true,
        duration: 1,
    });
  } else if (selectedArea === 'none') {
    map.flyTo([36, -92], 5, {
      animate: true,
      duration: 1,
    });
    // map.setMaxBounds(usaBounds);
  }
  return null;
};

export default StatesMap;
