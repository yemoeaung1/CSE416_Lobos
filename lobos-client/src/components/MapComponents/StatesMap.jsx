import {
  MapContainer,
  useMap,
  TileLayer,
  Pane,
  GeoJSON,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import views from "./Views";
import Color from "color";
import USA from "../../geojson/usa_2.json";
import { States } from "../../enums";

const StatesMap = ({ selectedState, setHoveredArea, selectedArea, setSelectedArea, mapView, setIsOpen, isOpen, filter }) => {
  const [colors, setColors] = useState([]);
  const [geoJSONLayer, setgeoJSONLayer] = useState(views[States.NONE]["state"]);

  useEffect(() => {
    setColors(getShades(filter, 4)); // Directly set the new colors
  }, [filter]);

  /* Change view */
  useEffect(() => {
    if (selectedState !== States.NONE) {
      setgeoJSONLayer(views[selectedArea][mapView.toLowerCase()]);
    }
  }, [mapView, selectedArea]);

  /* Change to original 2 state view */
  useEffect(() => {
    if (!isOpen) {
      setgeoJSONLayer(views[States.NONE]["state"]);
    }
  }, [isOpen]);

  let originalColor;

  const onEachFeature = (feature, layer) => {
    let popupContent = feature.properties.NAME;
    layer.bindPopup(renderToString(<PopUpCustom content={popupContent} />));

    layer.setStyle({
      fillColor: "#ff6961",
      fillOpacity: 0.5,
      color: "black",
      weight: 1,
    });
    layer.on({
      mouseover: (e) => {
        originalColor = e.target.options.fillColor;
        const darkerColor = Color(originalColor).darken(0.5).hex(); // Darken by 20%
        e.target.setStyle({ fillColor: darkerColor });
        layer.openPopup();
        setHoveredArea(feature.properties.NAME);
      },
      // Mouseout event - Revert to original color
      mouseout: (e) => {
        e.target.setStyle({ fillColor: originalColor });
        layer.closePopup();
        setHoveredArea(States.NONE);
      },
      click: (e) => {
        // console.log(feature.p); 
        if(selectedArea == feature.properties.NAME && !isOpen) {
          // setSelectedArea(feature.properties.NAME);
          setIsOpen(true);
        } else {
          setSelectedArea(feature.properties.NAME)
        }
      },
    });
  };

  const usaBounds = [
    [24.396308, -125.0], // Southwest corner
    [47.543285, -53.618125], // Northeast corner
  ];

  const countryBorder = (feature) => {
    return {
      fillColor: "#ffffff",
      fillOpacity: 0.5,
      color: "black",
      weight: 2,
    };
  };


  const filterToColor = {
    'republican': '#A30000',  // Darker red
    'democratic': '#000080',  // Darker blue
    'race': '#6A2C7D',       // Darker purple
    'black': '#9C3500',       // Darker orange
    'income': '#7A8503',      // Darker gold
    'age': '#A18C04'          // Darker yellow
  };
  
  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor.padStart(6, '0')}`; // Ensures the color is always 6 digits
  }
  
  const getShades = (filter, numShades) => {
    let color = filterToColor[filter];
    if(!color) {
      color = getRandomColor();
    }
    // Remove the '#' character if it's present
    color = color.replace('#', '');
    console.log(color);
  
    // Parse the base color into RGB components
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
  
    const shades = [];
  
    // Generate shades by adjusting the RGB values
    for (let i = 0; i < numShades; i++) {
      // Calculate a factor to lighten or darken the color
      const factor = (i + 1) / (numShades + 1); // Create a value between 0 and 1
  
      // Adjust RGB values
      const newR = Math.min(255, Math.floor(r + (255 - r) * factor)); // Lightening
      const newG = Math.min(255, Math.floor(g + (255 - g) * factor)); // Lightening
      const newB = Math.min(255, Math.floor(b + (255 - b) * factor)); // Lightening
  
      // Convert the new RGB values back to hexadecimal format
      let newShade = ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
      newShade = `#${newShade}`;
      newShade = Color(newShade).darken(0.1).hex();
      shades.push(newShade);
    }
  
    return shades.slice(0, numShades);
  }
  
  const mapPolygonColor = ((colors) => {
    return colors[Math.floor(Math.random() * colors.length)]
  })

  const styleWithFilter = (feature => {
    // let colors = getShades(filter, 5);
    return ({
        fillColor: mapPolygonColor(colors),
        weight: 1,
        opacity: 0.5,
        color: 'black',
        fillOpacity: 0.5
    });
});

const style = (feature) => {
  if(mapView !== 'State') {
    if(filter) {
      return styleWithFilter(feature)
    }
  } else {
  return {
    fillColor: "#ff6961",
    fillOpacity: 0.5,
    color: "black",
    weight: 1,
  };
};
}

  return (
    <>
      <MapContainer
        center={[36, -92]}
        zoom={5}
        style={{ width: "100%", zIndex: 1 }}
        maxBounds={usaBounds}
        maxBoundsViscosity={1}
        minZoom={5}
        preferCanvas={true} 
      >
        <MapController selectedArea={selectedArea} isOpen={isOpen} />
        {isOpen && (
          <>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <Pane name="labels" style={{ zIndex: 650 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
              />
            </Pane>
          </>
        )}
        {/* <Legend colors={colors} /> */}

        {/* Some type of border just around the US */}
        <GeoJSON key={"usa"} data={USA} style={countryBorder} zIndex={1} />

        <GeoJSON
          key={JSON.stringify(geoJSONLayer)}
          data={geoJSONLayer}
          onEachFeature={onEachFeature}
          zIndex={10}
          style={style}
        />
      </MapContainer>
    </>
  );
};


const MapController = ({ selectedArea, isOpen }) => {
  const map = useMap();

  const states = {
    [States.UTAH]: {
      'bounds': [[37.0, -114.052], [42.0016, -109.0419]],
      'center': [39.7, -106],
    },
    [States.SOUTH_CAROLINA]: {
      'bounds': [[32.0333, -83.3540], [35.2154, -78.5420]],
      'center': [33.5, -76]
    },
    [States.NONE]: {
      'bounds': [[24.396308, -125.0], [47.543285, -53.618125]],
      'center': [36, -92]
    }
  }

  const zoomToState = (state, states) => {
    map.flyTo(states[state].center, 7.25, {
      animate: true,
      duration: 2,
    }).setMaxBounds(states[state].bounds);
  }

  useEffect(() => {
    map.invalidateSize();
    map.setMinZoom(isOpen ? 7.25 : 5);
    if(!isOpen) {
      map.flyTo([36, -92], 5, {
        animate: true,
        duration: 2,
      }).setMaxBounds(states[States.NONE].bounds);
    } else {
      if (selectedArea in states) {
        zoomToState(selectedArea, states);
      }
    }
  }, [isOpen, selectedArea, map])

  return null;
};

const PopUpCustom = ({ content }) => {
  return <>{content}</>;
};

export default StatesMap;
