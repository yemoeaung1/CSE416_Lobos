import { GeoJSON } from "react-leaflet";
import Color from 'color';

const CongressionalDistrictMap = ({display}) => {
    let originalColor;

    const onEachCongressionalDistrict = (congressionalDistrict, layer) => {
        // const originalColor = e.target.options.fillColor;
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
                console.log(congressionalDistrict.properties);
                console.log(e.target.options.fillColor)
                // setSelectedArea(county.properties.NH_WHT);
            }
        });
    }

    const mapPolygonColor = (argument) => {
        return argument > 450000 ? 'blue'
        : argument > 400000 ? 'green'
        : argument > 350000 ? 'yellow'
        : 'purple'
      }
  
      const style = (feature => {
        return ({
            fillColor: mapPolygonColor(feature.properties.NH_WHT),
            fillOpacity: 0.5,
            color: "black",
            weight: 1,
          })
        });

        
    return  (
        <GeoJSON key={display[0]} data={display[1]} onEachFeature={onEachCongressionalDistrict} style={style}/>
    )
}

export default CongressionalDistrictMap;