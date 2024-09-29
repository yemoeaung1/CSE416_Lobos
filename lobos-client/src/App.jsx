import { useState } from "react";
import './App.css';
import StatesMap from "./components/StatesMap";
import NavBar from "./components/NavBar";

function App() {
  const [selectedArea, setSelectedArea] = useState(null);

  console.log(selectedArea);

  return (
    <div className="w-full h-full">
      <NavBar />
      <StatesMap setSelectedArea={setSelectedArea} selectedArea={selectedArea}/>
    </div>
  );
}

export default App;
