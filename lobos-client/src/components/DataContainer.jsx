import { useState } from "react";

import {
    BsArrowBarLeft,
    BsArrowBarRight,
    BsInfoCircle,
    BsFillBarChartFill,
    BsGraphUp,
    BsMap,
} from "react-icons/bs";
import { DataTabOptions, States } from "../enums";
import SummaryTab from "./DataSummaryComponents/SummaryTab";
import StateDataTab from "./DataStateDataComponents/StateDataTab";
import AnalysisTab from "./DataAnalysisComponents/AnalysisTab";
import EnsembleTab from "./DataEnsembleComponents/EnsembleTab";

export default function DataContainer({ isOpen, setIsOpen, selectedArea, selectedState, setMapView, setHeatmapOpts, setHighlightedDistrict }) {
  const [dataTab, setDataTab] = useState(DataTabOptions.SUMMARY);

    return (
        <div className="data-container">
            <DataOpenButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedArea={selectedArea}
            />

      <div>
        <DataTabs
          isOpen={isOpen}
          dataTab={dataTab}
          setDataTab={setDataTab}
        />
        <DataComponent
          isOpen={isOpen}
          dataTab={dataTab}
          selectedArea={selectedArea}
          selectedState={selectedState}
          setMapView={setMapView}
          setHeatmapOpts={setHeatmapOpts}
          setHighlightedDistrict={setHighlightedDistrict}
        />
      </div>

    </div>
  );
}

function DataOpenButton({ isOpen, setIsOpen, selectedArea }) {
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {(selectedArea !== States.NONE || isOpen) && (
                <div
                    className={`data-open-button ${isOpen ? "open" : ""}`}
                    onClick={() => toggleOpen()}
                >
                    {isOpen ? <BsArrowBarRight /> : <BsArrowBarLeft />}
                </div>
            )}
        </>
    );
}

function DataTabs({ isOpen, dataTab, setDataTab }) {
    return (
        <div className={`data-toolbar ${isOpen ? "open" : ""}`}>
            <div
                className={`toolbar-item ${
                    dataTab === DataTabOptions.SUMMARY ? "tool-selected" : ""
                }`}
                onClick={() => setDataTab(DataTabOptions.SUMMARY)}
            >
                <BsInfoCircle className="toolbar-icon" />
                <span className="toolbar-label">Summary</span>
            </div>

            <div
                className={`toolbar-item ${
                    dataTab === DataTabOptions.STATE_DATA ? "tool-selected" : ""
                }`}
                onClick={() => setDataTab(DataTabOptions.STATE_DATA)}
            >
                <BsFillBarChartFill className="toolbar-icon" />
                <span className="toolbar-label">State Data</span>
            </div>

            <div
                className={`toolbar-item ${
                    dataTab === DataTabOptions.ANALYSIS ? "tool-selected" : ""
                }`}
                onClick={() => setDataTab(DataTabOptions.ANALYSIS)}
            >
                <BsGraphUp className="toolbar-icon" />
                <span className="toolbar-label">Analysis</span>
            </div>

            <div
                className={`toolbar-item ${
                    dataTab === DataTabOptions.ENSEMBLE ? "tool-selected" : ""
                }`}
                onClick={() => setDataTab(DataTabOptions.ENSEMBLE)}
            >
                <BsMap className="toolbar-icon" />
                <span className="toolbar-label">Ensemble</span>
            </div>
        </div>
    );
}

function DataComponent({ isOpen, dataTab, selectedState, setMapView, setHeatmapOpts, setHighlightedDistrict }) {
  if (!isOpen) {
    return (
      <div className="data-component" />
    );
  }

  return (
    <div className="data-component open">
      {dataTab === DataTabOptions.SUMMARY && <SummaryTab selectedState={selectedState} setMapView={setMapView} setHighlightedDistrict={setHighlightedDistrict}/>}
      {dataTab === DataTabOptions.STATE_DATA && <StateDataTab/>}
      {dataTab === DataTabOptions.ANALYSIS && <AnalysisTab />}
      {dataTab === DataTabOptions.ENSEMBLE && <EnsembleTab setMapView={setMapView} setHeatmapOpts={setHeatmapOpts} />}
    </div>
  );
}
