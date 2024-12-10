import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Color from "color";
import { States } from "../../enums";

function StatesMap({
    selectedState,
    setHoveredArea,
    selectedArea,
    setSelectedArea,
    mapView,
    heatmapOpts,
    highlightedDistrict,
}) {
    const [mapData, setMapData] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/state-map`, {
                params: {
                    state: selectedState,
                    view: mapView,
                    heatmapOpts
                },
            })
            .then((response) => {
                setMapData(response.data);
            })
            .catch((error) => {
                console.error("Error Retrieving Map:", error);
            });
    }, [selectedState, mapView, heatmapOpts]);

    if (!mapData) {
        return (
            <div className="flex items-center justify-center averia-serif-title text-5xl">
                Loading Map
            </div>
        );
    }

    const onEachFeature = (feature, layer) => {
        let originalColor = '#FFFFFF';
        let darkerColor;

        if (feature.properties.ACTIVE)
            originalColor = '#F02525'; // RED
        else if (feature.properties.FCOLOR)
            originalColor = feature.properties.FCOLOR;

        const defaultStyle = {
            fillColor: originalColor,
            fillOpacity: feature.properties.FOPACITY || 0.75,
            color: feature.properties.COLOR || "#000000",
            weight: 1,
        };

        layer.setStyle(defaultStyle);

        layer.on({
            mouseover: (e) => {
                setHoveredArea(feature.properties.NAME);

                darkerColor = Color(originalColor).darken(0.25).hex();
                e.target.setStyle({ fillColor: darkerColor, weight: 3 });
            },
            mouseout: (e) => {
                setHoveredArea(States.NONE);

                e.target.setStyle({ fillColor: originalColor, weight: 1 });
            },
            click: (e) => {
                if (!feature.properties.ACTIVE) return;

                if (selectedArea != feature.properties.NAME) {
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
    const oldHighlightedDistrict = useRef(highlightedDistrict);

    const map = useMap();

    useEffect(() => {
        if (!map) return;

        map.eachLayer((layer) => {
            if (layer && layer.feature && layer.feature.properties) {
                const feature = layer.feature;

                const defaultStyle = {
                    fillColor: feature.properties.FCOLOR || "#ffffff",
                    fillOpacity: feature.properties.FOPACITY || 0.5,
                    color: feature.properties.color || "black",
                    weight: feature.properties.weight || 1,
                };

                if (
                    highlightedDistrict !== oldHighlightedDistrict.current &&
                    feature.properties.NAME === oldHighlightedDistrict.current
                ) {
                    layer.setStyle(defaultStyle);
                } else if (feature.properties.NAME === highlightedDistrict) {
                    layer.setStyle({
                        color: "black",
                        weight: 5,
                        fillColor: "#4CAF50",
                        fillOpacity: 0.7,
                    });
                }
            }
        });

        oldHighlightedDistrict.current = highlightedDistrict;
    }, [highlightedDistrict]);

    useEffect(() => {
        map.invalidateSize();

        map.options.minZoom = mapData.properties.MIN_ZOOM;
        map.options.maxZoom = mapData.properties.MAX_ZOOM;

        map.flyTo(mapData.properties.CENTER, mapData.properties.CURRENT_ZOOM, {
            animate: false,
        }).setMaxBounds(mapData.properties.MAX_BOUNDS);
    }, [mapData]);

    return null;
}

export default StatesMap;
