import { GiDogHouse, GiWolfHead } from "react-icons/gi";

function NavBar({ setSelectedArea, selectedState }) {
    const clearState = () => {
        setSelectedArea('none');
    }

    return (
        <div className="navbar">
            <div className="navbar-home text-white p-4">
                <GiWolfHead className="cursor-pointer" size={56} onClick={() => clearState()}/>
                <span className="text-5xl leading-none p-4 averia-serif cursor-pointer hover:bg-red-800" onClick={() => clearState()}>Lobos</span>
            </div>
            <div className="navbar-title text-white p-4">
                <span className="text-5xl leading-none p-4 averia-serif">{(selectedState !== 'none') ? selectedState : "[Select A State]"}</span>
            </div>
        </div>
    )
}

export default NavBar;