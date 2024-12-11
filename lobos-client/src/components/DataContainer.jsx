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

export default function DataContainer({ selectedArea, selectedState, setMapView, setHeatmapOpts, dataTab, setDataTab, districtYear, setDistrictYear, setHighlightedDistrict }) {
    return (
        <div className="data-container">
            <DataTabs
                selectedState={selectedState}
                dataTab={dataTab}
                setDataTab={setDataTab}
            />
            <DataComponent
                dataTab={dataTab}
                selectedArea={selectedArea}
                selectedState={selectedState}
                setMapView={setMapView}
                setHeatmapOpts={setHeatmapOpts}
                districtYear={districtYear}
                setDistrictYear={setDistrictYear}
                setHighlightedDistrict={setHighlightedDistrict}
            />
        </div>
    );
}

function DataTabs({ selectedState, dataTab, setDataTab }) {
    return (
        <div className={`data-toolbar ${(selectedState != States.NONE) ? "open" : ""}`}>
            <div
                className={`toolbar-item ${dataTab === DataTabOptions.SUMMARY ? "tool-selected" : ""
                    }`}
                onClick={() => setDataTab(DataTabOptions.SUMMARY)}
            >
                <BsInfoCircle className="toolbar-icon" />
                <span className="toolbar-label">Summary</span>
            </div>

            <div
                className={`toolbar-item ${dataTab === DataTabOptions.STATE_DATA ? "tool-selected" : ""
                    }`}
                onClick={() => setDataTab(DataTabOptions.STATE_DATA)}
            >
                <BsFillBarChartFill className="toolbar-icon" />
                <span className="toolbar-label">State Data</span>
            </div>

            <div
                className={`toolbar-item ${dataTab === DataTabOptions.ANALYSIS ? "tool-selected" : ""
                    }`}
                onClick={() => setDataTab(DataTabOptions.ANALYSIS)}
            >
                <BsGraphUp className="toolbar-icon" />
                <span className="toolbar-label">Analysis</span>
            </div>

            <div
                className={`toolbar-item ${dataTab === DataTabOptions.ENSEMBLE ? "tool-selected" : ""
                    }`}
                onClick={() => setDataTab(DataTabOptions.ENSEMBLE)}
            >
                <BsMap className="toolbar-icon" />
                <span className="toolbar-label">Ensemble</span>
            </div>
        </div>
    );
}

function DataComponent({ dataTab, selectedState, setMapView, setHeatmapOpts, districtYear, setDistrictYear, setHighlightedDistrict }) {
    if (selectedState == States.NONE) {
        return (
            <div className="data-component" />
        );
    }

  return (
    <div className="data-component open">
      {dataTab === DataTabOptions.SUMMARY && <SummaryTab selectedState={selectedState} setMapView={setMapView} districtYear={districtYear} setDistrictYear={setDistrictYear} setHighlightedDistrict={setHighlightedDistrict}/>}
      {dataTab === DataTabOptions.STATE_DATA && <StateDataTab selectedState={selectedState} setHeatmapOpts={setHeatmapOpts} setMapView={setMapView}/>}
      {dataTab === DataTabOptions.ANALYSIS && <AnalysisTab selectedState={selectedState} setMapView={setMapView} />}
      {dataTab === DataTabOptions.ENSEMBLE && <EnsembleTab setMapView={setMapView} setHeatmapOpts={setHeatmapOpts} />}
    </div>
  );
}
