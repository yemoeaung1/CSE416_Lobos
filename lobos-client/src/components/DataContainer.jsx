import { useEffect, useState } from "react";

import UtahFlag from "../assets/us_flags/ut.svg";
import SCarolinaFlag from "../assets/us_flags/sc.svg";

import {
    BsArrowBarLeft,
    BsArrowBarRight,
    BsInfoCircle,
    BsFillBarChartFill,
    BsGraphUp,
} from "react-icons/bs";
import BarGraph from "./barGraph";
import LineGraph from "./lineGraph";
import BoxPlotGraph from "./boxPlotGraph";
import IncomeVotingScatter from "./IncomeVotingScatter";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function DataContainer({ isOpen, setIsOpen, selectedArea }) {
    const [dataTool, setDataTool] = useState("info");

    return (
        <div className="data-container">
            {(selectedArea !== "none" || isOpen) && (
                <div
                    className={`data-open-button ${isOpen ? "open" : ""}`}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                    {isOpen ? <BsArrowBarRight /> : <BsArrowBarLeft />}
                </div>
            )}

            <div>
                <DataToolbar
                    isOpen={isOpen}
                    dataTool={dataTool}
                    setDataTool={setDataTool}
                />
                <DataComponent isOpen={isOpen} dataTool={dataTool} selectedArea={selectedArea} />
            </div>
        </div>
    );
}

function DataToolbar({ isOpen, dataTool, setDataTool }) {
    return (
        <div className={`data-toolbar ${isOpen ? "open" : ""}`}>
            <div
                className={`toolbar-item ${
                    dataTool === "info" ? "tool-selected" : ""
                }`}
                onClick={() => setDataTool("info")}
            >
                <BsInfoCircle className="toolbar-icon" />
                <span className="toolbar-label">State Info</span>
            </div>

            <div
                className={`toolbar-item ${
                    dataTool === "graph" ? "tool-selected" : ""
                }`}
                onClick={() => setDataTool("graph")}
            >
                <BsFillBarChartFill className="toolbar-icon" />
                <span className="toolbar-label">Graphs</span>
            </div>

            <div
                className={`toolbar-item ${
                    dataTool === "analysis" ? "tool-selected" : ""
                }`}
                onClick={() => setDataTool("analysis")}
            >
                <BsGraphUp className="toolbar-icon" />
                <span className="toolbar-label">Analysis</span>
            </div>
        </div>
    );
}

function DataComponent({ isOpen, dataTool, selectedArea }) {
    return (
        <div className={`data-component ${isOpen ? "open" : ""}`}>
            {dataTool === "info" && <DataComponent_Info selectedArea={selectedArea}/>}
            {dataTool === "graph" && <DataComponent_Graph />}
            {dataTool === "analysis" && (
                <div>
                    <IncomeVotingScatter />
                </div>
            )}
        </div>
    );
}

function DataComponent_Info({ selectedArea }){
  const flagMapping = {
    "Utah": UtahFlag,
    "South Carolina": SCarolinaFlag
  };

  return (
    <>
      <div className="data-component-info-top p-4">
        <div className="flag-container p-1">
          <img src={flagMapping[selectedArea]} alt="No Flag Found" style={{ width: '500px', height: '333px' }} />
        </div>
        <div className="data-component-info-right">
          <div className="data-component-info-text" style={{ backgroundColor: 'rgba(255, 215, 0, 1)', flex: 1 }}><span className="font-bold underline">Population</span>: 100,000</div>
          <div className="data-component-info-text" style={{ backgroundColor: 'rgba(180, 180, 180, 0.8)', flex: 1 }}><span className="font-bold underline">Average Income</span>: 100,000</div>
          <div className="data-component-info-text" style={{ backgroundColor: 'rgba(220, 220, 220, 0.8)', flex: 1 }}><span className="font-bold underline">Majority Race</span>: White</div>
          <div className="data-component-info-text" style={{ backgroundColor: 'rgba(180, 180, 180, 0.8)', flex: 1 }}><span className="font-bold underline">Party</span>: Democrat</div>
        </div>
      </div>
    </>
  );
}

function DataComponent_Graph() {
    const [graphType, setGraphType] = useState("bar");

    const handleSwitchChange = (event, type) => {
        if (event.target.checked) {
            setGraphType(type);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-8">
                <FormControlLabel
                    control={
                        <Switch
                            defaultChecked
                            checked={graphType === "bar"}
                            onChange={(e) => handleSwitchChange(e, "bar")}
                        />
                    }
                    label="Bar Graph"
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={graphType === "box"}
                            onChange={(e) => handleSwitchChange(e, "box")}
                        />
                    }
                    label="Box Plot"
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={graphType === "line"}
                            onChange={(e) => handleSwitchChange(e, "line")}
                        />
                    }
                    label="Line Graph"
                />
            </div>

            <div className="h-3/4 w-full">
                {graphType === "bar" && <BarGraph />}

                {graphType === "box" && <BoxPlotGraph />}

                {graphType === "line" && <LineGraph />}
            </div>
        </div>
    );
}

export default DataContainer;
