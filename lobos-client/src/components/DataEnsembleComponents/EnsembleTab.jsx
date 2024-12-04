import { useEffect } from "react";
import { DataFilters, MapViewOptions } from "../../enums";

export default function EnsembleTab({ setMapView, setHeatmapOpts }) {
    useEffect(() => {
      setHeatmapOpts(DataFilters.POVERTY_LEVEL);
      setMapView(MapViewOptions.PRECINCT);
    }, [])

    return (<></>);
}