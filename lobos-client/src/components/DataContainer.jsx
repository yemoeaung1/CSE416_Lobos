import { useEffect, useState } from "react";

import { BsArrowBarLeft, BsArrowBarRight, BsInfoCircle, BsFillBarChartFill, BsGraphUp } from "react-icons/bs";
import BarGraph from "./barGraph";

function DataContainer({isOpen, setIsOpen, selectedArea}) {
  const [dataTool, setDataTool ] = useState('info')

  return (
    <div className="data-container">
      { (selectedArea !== 'none' || isOpen) && 

        <div className={`data-open-button ${isOpen ? "open" : ""}`} onClick={() => {setIsOpen(!isOpen)}}>
          {isOpen ? <BsArrowBarRight /> : <BsArrowBarLeft />}
        </div>
      }

      <div>
        <DataToolbar isOpen={isOpen} dataTool={dataTool} setDataTool={setDataTool} />
        <DataComponent isOpen={isOpen} dataTool={dataTool}/>
      </div>

    </div>
  );
}

function DataToolbar({ isOpen, dataTool, setDataTool}){

    return (
      <div className={`data-toolbar ${isOpen ? "open" : ""}`}>

        <div className={`toolbar-item ${dataTool === 'info' ? "tool-selected" : ""}`} onClick = {() => setDataTool('info')}>
          <BsInfoCircle className="toolbar-icon"/>
          <span className="toolbar-label">State Info</span>
        </div>

        <div className={`toolbar-item ${dataTool === 'graph' ? "tool-selected" : ""}`} onClick = {() => setDataTool('graph')}>
          <BsFillBarChartFill className="toolbar-icon"/>
          <span className="toolbar-label">Graphs</span>
        </div>

        <div className={`toolbar-item ${dataTool === 'analysis' ? "tool-selected" : ""}`} onClick = {() => setDataTool('analysis')}>
          <BsGraphUp className="toolbar-icon"/>
          <span className="toolbar-label">Analysis</span>
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