import { useEffect } from "react";
import { MapViewOptions } from "../../enums";

export default function EnsembleTab({ setMapView, setHeatmapOpts }) {
    useEffect(() => {
      setHeatmapOpts("Economic");
      setMapView(MapViewOptions.PRECINCT);
    }, [])

    return (<></>);
}