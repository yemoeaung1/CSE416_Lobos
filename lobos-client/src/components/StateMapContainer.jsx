import axios from "axios";
import qs from "qs";
import { useEffect, useRef, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import Color from "color";
import { HeatMapFilters, MapViewOptions, PoliColors, States } from "../enums";

export default function StateMapContainer({ isLoading, setIsLoading, mapView, setMapView, selectedState, setHoveredArea, setSelectedArea, selectedArea, heatmapOpts, highlightedDistrict }) {
    return (
        <div className="wrapper" style={{ width: (selectedState !== States.NONE) ? "40%" : "100%" }}>
            <StatesMap
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                selectedState={selectedState}
                setHoveredArea={setHoveredArea}
                setSelectedArea={setSelectedArea}
                selectedArea={selectedArea}
                mapView={mapView}
                setMapView={setMapView}
                heatmapOpts={heatmapOpts}
                highlightedDistrict={highlightedDistrict}
            />
        </div>
    )
}

function StatesMap({
    isLoading,
    setIsLoading,
    selectedState,
    setHoveredArea,
    selectedArea,
    setSelectedArea,
    mapView,
    setMapView,
    heatmapOpts,
    highlightedDistrict,
}) {
    const [mapData, setMapData] = useState(null);

    useEffect(() => {
        if(isLoading){
            console.log("Loading Failure: Multiple Axios Requests");
            return;
        }

        if(mapView == MapViewOptions.PRECINCT && heatmapOpts[0] == HeatMapFilters.DEMOGRAPHIC && heatmapOpts.length < 2){
            console.log("Demographic Heat Map: No Option Selected");
            return
        }

        setIsLoading(true);
        axios
            .get(`http://localhost:8080/api/state-map`, {
                params: {
                    state: selectedState,
                    view: mapView,
                    heatmapOpts
                },
                paramsSerializer: (params) => {
                  return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then((response) => {
                setMapData(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error Retrieving Map:", error);
                setIsLoading(false);
            });
    }, [mapView, heatmapOpts]);

    if(!mapData)
        return;

    const onEachFeature = (feature, layer) => {
        let originalColor;
    
        if (feature.properties.ACTIVE == 'R')
            originalColor = PoliColors.REPUBLICAN;
        else if(feature.properties.ACTIVE == 'D')
            originalColor = PoliColors.DEMOCRATIC;
        else if (feature.properties.FCOLOR)
            originalColor = feature.properties.FCOLOR;
        else
            originalColor = '#FFFFFF';
    
        const darkerColor = Color(originalColor).darken(0.25).hex();
    
        layer.setStyle({
            fillColor: originalColor,
            fillOpacity: feature.properties.FOPACITY || 0.75,
            color: feature.properties.COLOR || "#000000",
            weight: 1,
        });
    
        layer.on({
            mouseover: (e) => {
                setHoveredArea(feature);
                e.target.setStyle({ fillColor: darkerColor, weight: 3 });
            },
            mouseout: (e) => {
                setHoveredArea(null);
                e.target.setStyle({ fillColor: originalColor, weight: 1 });
            },
            click: (e) => {
                if (feature.properties.ACTIVE)
                    setSelectedArea(feature.properties.NAME);
            },
        });
    };

    return (
        <>
            <MapContainer
                preferCanvas={true}
                maxBoundsViscosity={1}
                center={mapData.properties.CENTER}
                maxBounds={mapData.properties.MAX_BOUNDS}
                zoom={mapData.properties.CURRENT_ZOOM}
                minZoom={mapData.properties.MIN_ZOOM}
                maxZoom={mapData.properties.MAX_ZOOM}
            >
                <MapController
                    selectedArea={selectedArea}
                    mapData={mapData}
                    highlightedDistrict={highlightedDistrict}
                />

                <GeoJSON
                    key={JSON.stringify(mapData.geoJSON)}
                    data={mapData.geoJSON}
                    onEachFeature={onEachFeature}
                    zIndex={1}
                />
            </MapContainer>
        </>
    );
}

function MapController({ mapData, highlightedDistrict }) {
    const map = useMap();

    const oldHighlightedDistrict = useRef(highlightedDistrict);

    useEffect(() => {
        if (!map) return;

        map.eachLayer((layer) => {
            if (layer && layer.feature && layer.feature.properties) {
                const feature = layer.feature;

                const defaultStyle = {
                    fillColor: feature.properties.FCOLOR || "#FFFFFF",
                    fillOpacity: feature.properties.FOPACITY || 0.75,
                    color: feature.properties.COLOR || "#000000",
                    weight: 1,
                };

                let highlightColor;
                if(highlightedDistrict && highlightedDistrict.party == "Republican")
                    highlightColor = PoliColors.REPUBLICAN;
                else if(highlightedDistrict && highlightedDistrict.party == "Democratic")
                    highlightColor = PoliColors.DEMOCRATIC;
                else
                    highlightColor = PoliColors.INDEPENDENT;

                const highlightedStyle = {
                    fillColor: highlightColor,
                    fillOpacity: 0.75,
                    color: "#000000",
                    weight: 5,
                }

                if (
                    highlightedDistrict.name !== oldHighlightedDistrict.current.name &&
                    feature.properties.NAME === oldHighlightedDistrict.current.name
                ) {
                    layer.setStyle(defaultStyle);
                } else if (feature.properties.NAME === highlightedDistrict.name) {
                    layer.setStyle(highlightedStyle);
                }
            }
        });

        oldHighlightedDistrict.current = highlightedDistrict;
    }, [highlightedDistrict]);

    useEffect(() => {
        map.options.minZoom = mapData.properties.MIN_ZOOM;
        map.options.maxZoom = mapData.properties.MAX_ZOOM;
        map.setMaxBounds(mapData.properties.MAX_BOUNDS);

        map.flyTo(mapData.properties.CENTER, mapData.properties.CURRENT_ZOOM, {
            animate: false,
        });

        map.invalidateSize();
    }, [mapData]);

    return null;
}