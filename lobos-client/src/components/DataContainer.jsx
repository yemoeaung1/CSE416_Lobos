import { useEffect, useState } from "react";

import { BsArrowBarLeft, BsArrowBarRight, BsInfoCircle, BsFillBarChartFill, BsGraphUp } from "react-icons/bs";
import BarGraph from "./barGraph";
import LineGraph from "./lineGraph";
import BoxPlotGraph from "./boxPlotGraph";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IncomeVotingScatter from "./IncomeVotingScatter";

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
          <span className="toolbar-label">Info</span>
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

      {dataTool === 'analysis' && (
        <div>
          <IncomeVotingScatter/>
        </div>
      )}

    </div>
  );
}

function DataComponent_Graph(){
  const [graphType, setGraphType] = useState('bar')
  const [dataSetType, setDataSetType] = useState('party');

  const handleSwitchChange = (event, type) => {
    if (event.target.checked) {
      setGraphType(type);

    if (type !== "bar" && dataSetType === "party") {
      setDataSetType("race");
    }
    }
  };

    return(
      <div className="flex flex-col h-full">
          <div className = "mb-8 flex justify-between ">

            <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Graph Filters: </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                 
                  <FormControlLabel value="bar " control={<Radio checked={graphType === "bar"} 
                  onChange={(e) => handleSwitchChange(e, "bar")} />} label="Bar Graph" />

                  {dataSetType !== "party" && (
                  <>
                    <FormControlLabel value="box" control={<Radio checked={graphType === "box"}  
                    onChange={(e) => handleSwitchChange(e, "box")}/>} label="Box Plot" />
                    <FormControlLabel value="line" control={<Radio checked={graphType === "line"} 
                    onChange={(e) => handleSwitchChange(e, "line")}/>} label="Line Graph" />
                  </>
                  )}
                  
                </RadioGroup>
            </FormControl>

            {/*Buttons on the top right corner*/}
            <div className="mt-5">
              {graphType === 'bar' && 
                <button className= {dataSetType === 'party' ? 'text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white' :
                'text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl'}
                onClick={() => {setDataSetType("party")}}>Party </button>
              }
            
              <button className= {dataSetType === 'race' ? 'text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white' :
              'text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl'}
              onClick={() => setDataSetType("race")}>Race </button>

              <button className={dataSetType === 'income' ? 'text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white' :
              'text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl'}
              onClick={() => setDataSetType("income")}> Income </button>

              <button className={dataSetType === 'age' ? 'text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white' :
              'text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl'}
              onClick={() => setDataSetType("age")}> Age </button>
          </div>

          </div>
          
          <div className="h-3/4 w-full">
            {graphType === "bar" && <BarGraph dataSetType={dataSetType}/>}
            {graphType === "box" && <BoxPlotGraph dataSetType={dataSetType}/>}
            {graphType === "line" && <LineGraph dataSetType={dataSetType}/>}
          </div>
        </div>
    )
}

export default DataContainer;