import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";
import Color from "color";
import { States } from "../../enums";

function StatesMap({
    selectedState,
    setHoveredArea,
    selectedArea,
    setSelectedArea,
    mapView,
    setIsOpen,
    isOpen,
    heatmapOpts,
    highlightedDistrict,
}) {
    const [mapData, setMapData] = useState(null);
    console.log(selectedState);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/state-map`, {
                params: {
                    state: selectedState,
                    view: mapView,
                    heatmapOpts,
                },
            })
            .then((response) => {
                setMapData(response.data);
            })
            .catch((error) => {
                console.error("Error Retrieving Map:", error);
            });
    }, [selectedState, mapView]);

    if (!mapData) {
        return (
            <div className="flex items-center justify-center averia-serif text-5xl">
                Loading Map
            </div>
        );
    }

    const onEachFeature = (feature, layer) => {
        let originalColor;
        let darkerColor;

        const defaultStyle = {
            fillColor: feature.properties.fillColor || "#ffffff",
            fillOpacity: feature.properties.fillOpacity || 0.5,
            color: feature.properties.color || "black",
            weight: feature.properties.weight || 2,
        };

        layer.setStyle(defaultStyle);

        layer.on({
            mouseover: (e) => {
                originalColor = e.target.options.fillColor;
                if (originalColor == "#ffffff") return;

                darkerColor = Color(originalColor).darken(0.5).hex();
                e.target.setStyle({ fillColor: darkerColor });
                setHoveredArea(feature.properties.NAME);
            },
            mouseout: (e) => {
                if (originalColor == "#ffffff") return;

                e.target.setStyle({ fillColor: originalColor });
                setHoveredArea(States.NONE);
            },
            click: (e) => {
                if (originalColor == "#ffffff") return;

                if (selectedArea == feature.properties.NAME && !isOpen) {
                    setIsOpen(true);
                } else {
                    setSelectedArea(feature.properties.NAME);
                }
            },
        });
    };

    return (
        <>
            <MapContainer
                preferCanvas={true}
                style={{ width: "100%" }}
                maxBoundsViscosity={1}
                center={mapData.properties.CENTER}
                maxBounds={mapData.properties.MAX_BOUNDS}
                zoom={mapData.properties.CURRENT_ZOOM}
                minZoom={mapData.properties.MIN_ZOOM}
                maxZoom={mapData.properties.MAX_ZOOM}
            >
                <MapController
                    isOpen={isOpen}
                    selectedArea={selectedArea}
                    mapData={mapData}
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

function MapController({ isOpen, mapData }) {
    const map = useMap();

    useEffect(() => {
        map.invalidateSize();
    }, [isOpen]);

    useEffect(() => {
        map.options.minZoom = mapData.properties.MIN_ZOOM;
        map.options.maxZoom = mapData.properties.MAX_ZOOM;
    }, [mapData]);

    useEffect(() => {
        map.flyTo(mapData.properties.CENTER, mapData.properties.CURRENT_ZOOM, {
            animate: false,
        }).setMaxBounds(mapData.properties.MAX_BOUNDS);
    }, [isOpen, mapData, map]);

    return null;
}

export default StatesMap;
