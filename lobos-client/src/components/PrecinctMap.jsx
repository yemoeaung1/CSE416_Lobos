import { GeoJSON } from "react-leaflet";

const PrecinctMap = ({display}) => {

    const colors = ['red', 'blue', 'yellow', 'cyan', 'green'];

    const onEachCounty = (county, layer) => {
        layer.on({
            // mouseover: (e) => {
            //     e.target.setStyle({ fillColor: "#9b111e" });
            //   },
            // mouseout:(e) => {
            //     e.target.setStyle({ fillColor: "#ff6961" });
            //   },
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

export default PrecinctMap;