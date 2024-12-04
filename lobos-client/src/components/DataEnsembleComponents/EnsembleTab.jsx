import { useEffect } from "react";
import { DataFilters, MapViewOptions } from "../../enums";

export default function EnsembleTab({ setMapView, setHeatmapOpts }) {

  useEffect(() => {
    setMapView(MapViewOptions.PRECINCT);
  }, [])

  return (<></>);
}