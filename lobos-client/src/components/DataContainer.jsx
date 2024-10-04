import { useEffect, useState } from "react";

import { BsArrowBarLeft, BsArrowBarRight, BsInfoCircle, BsFillBarChartFill, BsBarChart } from "react-icons/bs";
import BarGraph from "./barGraph";

function DataContainer() {
    const [isOpen, setIsOpen] = useState(false);
    const [dataTool, setDataTool ] = useState('info')

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

  return (
    <div className="data-container">
      <div className={`data-open-button ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        {isOpen ? <BsArrowBarRight /> : <BsArrowBarLeft />}
      </div>

      <div>
        <DataToolbar isOpen={isOpen} setDataTool={setDataTool} />
        <DataComponent isOpen={isOpen} dataTool={dataTool}/>
      </div>

    </div>
  );
}

function DataToolbar({ isOpen, setDataTool}){

    return (
      <div className={`data-toolbar ${isOpen ? "open" : ""}`}>

        <div className="toolbar-item">
          <BsInfoCircle className="toolbar-icon" onClick = {() => setDataTool('info')}/>
          <span className="toolbar-label">Info</span>
        </div>

        <div className="toolbar-item">
          <BsFillBarChartFill className="toolbar-icon" onClick = {() => setDataTool('graph')}/>
          <span className="toolbar-label">Graphs</span>
        </div>
        
      </div>
    );
}

function DataComponent({ isOpen, dataTool}){
  return (
    <div className={`data-component ${isOpen ? "open" : ""}`}>
      
      {dataTool === 'info' && (
        <div>
          <h1>
            State Info:
          </h1>
        </div> 
      )}
      
      {dataTool === 'graph' && (
        <div className = 'text-black' >
          <BarGraph/>
        </div>
      )}
      

    </div>
  );
}

export default DataContainer;