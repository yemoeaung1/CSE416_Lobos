import { MapViewOptions } from "../../enums";

const MapLayerSelector = ({ mapView, setMapView }) => {
    const views = [MapViewOptions.STATE, MapViewOptions.DISTRICT, MapViewOptions.PRECINCT];

    const changeMapView = (e) => {
        setMapView(e.target.value);
    };

    return (
        <div className="layer-switch h-8 w-full flex items-center justify-end">
            <select
                value={mapView}
                onChange={changeMapView}
                className="h-8 w-36 mt-12 mr-4 px-2 bg-white border-2 border-gray-700 rounded-lg text-lg"
            >
                {views.map((view) => (
                    <option key={view} value={view}>
                        {view}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MapLayerSelector;
