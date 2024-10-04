import { GiDogHouse, GiWolfHead } from "react-icons/gi";

const NavBar = ({setMapView, setSelectedArea, selectedArea}) => {
    const onHomeClick = () => {
        setMapView('State');
        setSelectedArea('none');
    }

    return (
        <div className="navbar">
            <div className="navbar-home text-white p-4">
                <div className="toolbar-item" onClick={() => {onHomeClick()}}>
                    <GiDogHouse className="toolbar-icon"/>
                    <span className="toolbar-label">Home</span>
                </div>
            </div>
            <div className="navbar-title text-white p-4">
                <GiWolfHead size={56} />
                <span className="text-5xl leading-none p-4">{(selectedArea !== 'none') ? selectedArea : "Lobos"}</span>
            </div>
        </div>
    )
}

export default NavBar;