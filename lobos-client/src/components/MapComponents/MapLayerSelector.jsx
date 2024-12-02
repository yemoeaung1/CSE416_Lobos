const MapLayerSelector = ({ state, setMapView }) => {
    const views = ["State", "Congressional", "County", "Precinct"];

    const changeMapView = (e) => {
        console.log(e.target.value);
        setMapView(e.target.value);
    };

    return (
        <div className="layer-switch h-9 w-full flex items-center justify-end">
            <label htmlFor="mapViewSelector" className="sr-only">
                Select Map View
            </label>
            <select
                id="mapViewSelector"
                onChange={changeMapView}
                className="h-9 w-48 px-7 font-dark bg-white border-2 border-gray-700 rounded-lg text-lg mt-11"
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
