import { GeoJSON } from "react-leaflet";
import Color from "color";

const CountyMap = ({display}) => {

    const colors = ['red', 'blue', 'yellow', 'cyan', 'green'];
    let originalColor;

    const onEachCounty = (county, layer) => {
        layer.on({
            mouseover: (e) => {
                originalColor = e.target.options.fillColor;
                const darkerColor = Color(originalColor).darken(0.5).hex(); // Darken by 20%
                e.target.setStyle({ fillColor: darkerColor });
              },
              // Mouseout event - Revert to original color
              mouseout: (e) => {
                e.target.setStyle({ fillColor: originalColor });
              },
            click: (e) => {
                console.log(county.properties);
                console.log(e.target.options.fillColor)
                // setSelectedArea(county.properties.NH_WHT);
            }
        });
    }

    const mapPolygonColor = (argument) => {
        return colors[Math.floor(Math.random() * colors.length)]   
    }
  
      const style = (feature => {
        return ({
            fillColor: mapPolygonColor(feature),
            fillOpacity: 0.5,
            color: "black",
            weight: 1,
          })
        });

        
    return  (
        <GeoJSON key={display[0]} data={display[1]} onEachFeature={onEachCounty} style={style}/>
    )
}

export default CountyMap;