import { GiDogHouse, GiWolfHead } from "react-icons/gi";

function NavBar({ setSelectedArea, selectedState }) {
    const clearState = () => {
        setSelectedArea('none');
    }

    return (
        <div className="navbar">
            <div className="navbar-home text-white p-4">
                <div className="flex flex-row items-center justify-center cursor-pointer hover:bg-red-800 pl-2" onClick={() => clearState()}>
                    <GiWolfHead size={56}/>
                    <span className="text-5xl leading-none p-4 averia-serif">Lobos</span>
                </div>
            </div>
            <div className="navbar-title text-white p-4">
                <span className="text-5xl leading-none p-4 averia-serif">{(selectedState !== 'none') ? selectedState : "[Select A State]"}</span>
            </div>
        </div>
    )
}

export default NavBar;