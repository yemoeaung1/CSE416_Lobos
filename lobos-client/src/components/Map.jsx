import { GeoJSON } from "react-leaflet";

const Map = ({ display, onEachFeature }) => {
    return (
        <>
            <GeoJSON key={display[0]} data={display[1]} onEachFeature={onEachFeature} zIndex={10}/>
        </>
    )
}

export default Map;