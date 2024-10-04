import { useEffect, useState } from "react";

import { BsArrowBarLeft, BsArrowBarRight, BsInfoCircle, BsFillBarChartFill, BsGraphUp } from "react-icons/bs";
import BarGraph from "./barGraph";
import LineGraph from "./lineGraph";
import BoxPlotGraph from "./boxPlotGraph";

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


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
          <DataComponent_Graph/>
      )}

    </div>
  );
}

function DataComponent_Graph(){
  const [graphType, setGraphType] = useState('bar')

  const handleSwitchChange = (event, type) => {
    if (event.target.checked) {
      setGraphType(type);
    }
  };

    return(
      <div className="flex flex-col h-full">
          <div className = "mb-8">
              <FormControlLabel control={<Switch defaultChecked checked={graphType === "bar"} 
              onChange={(e) => handleSwitchChange(e, "bar")} />} label="Bar Graph" />

              <FormControlLabel control={<Switch checked={graphType === "box"} 
              onChange={(e) => handleSwitchChange(e, "box")} />} label="Box Plot" />

              <FormControlLabel control={<Switch  checked={graphType === "line"} 
              onChange={(e) => handleSwitchChange(e, "line")}/>} label="Line Graph" />
          </div>
          
          <div className="h-3/4 w-full">
            
            {graphType === 'bar' && (
                <BarGraph/>
            )}

            {graphType === 'box' && (
                <BoxPlotGraph/>
            )}

            {graphType === 'line' && (
                <LineGraph/>
            )}

          </div>
        </div>
    )
}

export default DataContainer;