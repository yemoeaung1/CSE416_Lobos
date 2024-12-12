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

export default function DataContainer({ isLoading, selectedArea, selectedState, mapView, setMapView, heatmapOpts, setHeatmapOpts, dataTab, setDataTab, districtYear, setDistrictYear, setHighlightedDistrict }) {
    return (
        <div className="data-container">
            <DataTabs
                isLoading={isLoading}
                selectedState={selectedState}
                dataTab={dataTab}
                setDataTab={setDataTab}
            />
            <DataComponent
                dataTab={dataTab}
                isLoading={isLoading}
                selectedArea={selectedArea}
                selectedState={selectedState}
                mapView={mapView}
                setMapView={setMapView}
                heatmapOpts={heatmapOpts}
                setHeatmapOpts={setHeatmapOpts}
                districtYear={districtYear}
                setDistrictYear={setDistrictYear}
                setHighlightedDistrict={setHighlightedDistrict}
            />
        </div>
    );
}

function DataTabs({ isLoading, selectedState, dataTab, setDataTab }) {
    const trySetDataTab = (opt) => {
        if(isLoading){
            console.log("Loading Failure: Switching Tabs");
            return;
        }
        
        setDataTab(opt);
    }

    return (
        <div className={`data-toolbar ${(selectedState != States.NONE) ? "open" : ""}`}>
            <div
                className={`toolbar-item ${dataTab === DataTabOptions.SUMMARY ? "tool-selected" : ""
                    }`}
                onClick={() => trySetDataTab(DataTabOptions.SUMMARY)}
            >
                <BsInfoCircle className="toolbar-icon" />
                <span className="toolbar-label">Summary</span>
            </div>

            <div
                className={`toolbar-item ${dataTab === DataTabOptions.STATE_DATA ? "tool-selected" : ""
                    }`}
                onClick={() => trySetDataTab(DataTabOptions.STATE_DATA)}
            >
                <BsFillBarChartFill className="toolbar-icon" />
                <span className="toolbar-label">State Data</span>
            </div>

            <div
                className={`toolbar-item ${dataTab === DataTabOptions.ANALYSIS ? "tool-selected" : ""
                    }`}
                onClick={() => trySetDataTab(DataTabOptions.ANALYSIS)}
            >
                <BsGraphUp className="toolbar-icon" />
                <span className="toolbar-label">Analysis</span>
            </div>

            <div
                className={`toolbar-item ${dataTab === DataTabOptions.ENSEMBLE ? "tool-selected" : ""
                    }`}
                onClick={() => trySetDataTab(DataTabOptions.ENSEMBLE)}
            >
                <BsMap className="toolbar-icon" />
                <span className="toolbar-label">Ensemble</span>
            </div>
        </div>
    );
}

function DataComponent({ dataTab, isLoading, selectedState, mapView, setMapView, heatmapOpts, setHeatmapOpts, districtYear, setDistrictYear, setHighlightedDistrict }) {
    if (selectedState == States.NONE) {
        return (
            <div className="data-component" />
        );
    }

  return (
    <div className="data-component open">
      {dataTab === DataTabOptions.SUMMARY && <SummaryTab isLoading={isLoading} selectedState={selectedState} mapView={mapView} setMapView={setMapView} districtYear={districtYear} setDistrictYear={setDistrictYear} setHighlightedDistrict={setHighlightedDistrict}/>}
      {dataTab === DataTabOptions.STATE_DATA && <StateDataTab isLoading={isLoading} selectedState={selectedState} heatmapOpts={heatmapOpts} setHeatmapOpts={setHeatmapOpts} mapView={mapView} setMapView={setMapView}/>}
      {dataTab === DataTabOptions.ANALYSIS && <AnalysisTab selectedState={selectedState} mapView={mapView} setMapView={setMapView} />}
      {dataTab === DataTabOptions.ENSEMBLE && <EnsembleTab mapView={mapView} setMapView={setMapView} setHeatmapOpts={setHeatmapOpts} />}
    </div>
  );
}
