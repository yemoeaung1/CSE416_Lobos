import { useEffect } from "react";
import { DataFilters, MapViewOptions } from "../../enums";

export default function EnsembleTab({ setMapView, setHeatmapOpts }) {
    useEffect(() => {
      setHeatmapOpts(DataFilters.ECO_DEMOGRAPHIC);
      setMapView(MapViewOptions.PRECINCT);
    }, [])

    return (<></>);
}