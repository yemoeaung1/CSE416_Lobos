/* Used to test my view switch */


const MapLayerSelector = ({state, setMapView}) => {
    let views = ['State', 'Congressional', 'County', 'Precinct']

    const changeMapView = (e) => {
        console.log(e.target.name);
        setMapView(e.target.name);
    }
    
    return (
        <div className="layer-switch mx-20 bg-white h-8">
            {views.map(view => {
                return (
                    <button name={view} onClick={changeMapView} className="w-fit h-full px-4 font-light hover:bg-slate-500">{view}</button>
                )
            })}
        </div>
    )
}


export default MapLayerSelector;