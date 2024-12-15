import axios from 'axios';
import { useEffect, useState } from "react";
import { MapViewOptions } from '../../enums';
import StateSummaryTab from './StateSummaryTab';
import DistrictSummaryTab from './DistrictSummaryTab';
import PrecinctSummaryTab from './PrecinctSummaryTab';

export default function SummaryTab({ isLoading, selectedState, heatmapOpts, setHeatmapOpts, hoveredArea, mapView, setMapView, districtYear, setDistrictYear, setHighlightedDistrict }) {
  const [selectedTab, setSelectedTab] = useState(MapViewOptions.STATE);

  return (
    <>
      <TabSelector isLoading={isLoading} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {selectedTab == MapViewOptions.STATE &&
        <StateSummaryTab
          selectedState={selectedState}
          mapView={mapView}
          setMapView={setMapView}
        />
      }

      {selectedTab == MapViewOptions.DISTRICT &&
        <DistrictSummaryTab
          isLoading={isLoading}
          selectedState={selectedState}
          mapView={mapView}
          setMapView={setMapView}
          districtYear={districtYear}
          setDistrictYear={setDistrictYear}
          setHighlightedDistrict={setHighlightedDistrict}
        />
      }

      {selectedTab == MapViewOptions.PRECINCT &&
        <PrecinctSummaryTab
          isLoading={isLoading}
          selectedState={selectedState}
          heatmapOpts={heatmapOpts}
          setHeatmapOpts={setHeatmapOpts}
          hoveredArea={hoveredArea}
          mapView={mapView}
          setMapView={setMapView}
        />
      }
    </>
  );
}

function TabSelector({ isLoading, selectedTab, setSelectedTab }) {

  const tabStyle = {
    cursor: "pointer",
    paddingBottom: "4px",
    marginRight: "8px",
    fontSize: "16px",
    transition: "color 0.3s ease",
    color: "#6b7280",
    borderBottom: "2px solid transparent",
  };

  const activeTabStyle = {
    ...tabStyle,
    color: "#2563eb",
    borderBottom: "4px solid #2563eb",
  };

  return (
    <nav
      className="flex justify-end mb-4 space-x-8 border-b-2 border-gray-300"
      style={{ borderBottom: "2px solid #e5e7eb" }}
      disabled={isLoading}
    >
      <div
        style={
          selectedTab == MapViewOptions.STATE
            ? activeTabStyle
            : tabStyle
        }
        onClick={() => setSelectedTab(MapViewOptions.STATE)}
      >
        State Summary
      </div>
      <div
        style={
          selectedTab == MapViewOptions.DISTRICT
            ? activeTabStyle
            : tabStyle
        }
        onClick={() => setSelectedTab(MapViewOptions.DISTRICT)}
      >
        District Summary
      </div>
      <div
        style={
          selectedTab == MapViewOptions.PRECINCT
            ? activeTabStyle
            : tabStyle
        }
        onClick={() => setSelectedTab(MapViewOptions.PRECINCT)}
      >
        Precinct Summary
      </div>
    </nav>
  )
}