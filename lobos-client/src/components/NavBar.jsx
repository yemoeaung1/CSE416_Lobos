/* Used to test my view switch */

const NavBar = ({setMapView, setSelectedArea}) => {
    return (
        <div className="navbar text-white p-4">
            <button onClick={()=> {
                setMapView('State');
                setSelectedArea('none');
            }}>Home</button>
        </div>
    )
}

export default NavBar;