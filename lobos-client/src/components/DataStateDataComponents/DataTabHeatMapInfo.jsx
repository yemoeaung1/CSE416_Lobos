import { Box, Button, ButtonGroup } from "@mui/material";
import { HeatMapFilters } from "../../enums";

export default function HeatMapInfo({ isLoading, heatmapOpts, setHeatmapOpts, legendInfo, hoveredArea }) {
    return (
        <div className="flex flex-row">
            <HeatMapLegend
                legendInfo={legendInfo}
                hoveredArea={hoveredArea}
            />
            <HeatMapSelection
                isLoading={isLoading}
                heatmapOpts={heatmapOpts}
                setHeatmapOpts={setHeatmapOpts}
            />
        </div>
    );
}

function HeatMapLegend({ legendInfo, hoveredArea }) {
    let hoveredBin = null;
    if (legendInfo !== null && hoveredArea !== null) {
        hoveredBin = legendInfo.find(
            (legend) => legend.color === hoveredArea.properties.FCOLOR
        );
    }

    if (!hoveredBin) {
        hoveredBin = {
            name: "N/A",
            color: "hsl(0 100% 100%)",
            opacity: 1
        }
    }

    return (
        <div className="data-component-data-heatmap-legend">
            <h1>Legend</h1>
            <div>
                {legendInfo == null &&
                    <>
                        LEGEND NULL
                    </>
                }

                {legendInfo != null &&
                    <>
                        {Object.entries(legendInfo).map(([key, { name, color, opacity }]) => (
                            <HeatMapLegendBin
                                key={key}
                                name={name}
                                color={color}
                                opacity={opacity}
                            />
                        ))}
                    </>
                }
            </div>
            <div>
                <span>Hovering:</span>
                <HeatMapLegendBin
                    name={hoveredBin.name}
                    color={hoveredBin.color}
                    opacity={hoveredBin.opacity}
                />
            </div>
        </div>
    );
}

function HeatMapLegendBin({ name, color, opacity }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    opacity: opacity,
                    border: '1px solid #000',
                }}
            ></div>
            <span>{name}</span>
        </div>
    );
}

function HeatMapSelection({ isLoading, heatmapOpts, setHeatmapOpts }) {
    const heatmapButtons = [
        HeatMapFilters.NONE,
        HeatMapFilters.POVERTY_LEVEL,
        HeatMapFilters.REGION_TYPE,
        HeatMapFilters.ECONOMIC,
        HeatMapFilters.ECO_POLITICAL,
        HeatMapFilters.DEMOGRAPHIC
    ]

    const raceOptions = [
        "Black",
        "Asian",
        "Hispanic"
    ]

    return (
        <div className="data-component-data-heatmap-selection">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <ButtonGroup
                    variant="contained"
                    aria-label="linked button group"
                    orientation="vertical"
                    disabled={isLoading}
                >
                    {heatmapButtons.map((element) => (
                        <HeatMapButton
                            key={element}
                            heatmapOpts={heatmapOpts}
                            setHeatmapOpts={setHeatmapOpts}
                            buttonType={element}
                        />
                    ))}
                </ButtonGroup>
                <ButtonGroup
                    variant="contained"
                    aria-label="linked button group"
                    orientation="vertical"
                    disabled={heatmapOpts[0] != HeatMapFilters.DEMOGRAPHIC}
                >
                    {raceOptions.map((element) => (
                        <HeatMapRaceButton
                            key={element}
                            heatmapOpts={heatmapOpts}
                            setHeatmapOpts={setHeatmapOpts}
                            buttonType={element}
                        />
                    ))}
                </ButtonGroup>
            </Box>
        </div>
    );
}

function HeatMapButton({ heatmapOpts, setHeatmapOpts, buttonType }) {
    const isButtonSelected = (heatmapOpts && heatmapOpts.length > 0 && heatmapOpts[0] === buttonType);

    return (
        <Button
            onClick={() => setHeatmapOpts([buttonType])}
            sx={{
                backgroundColor: isButtonSelected ? "primary.main" : "grey.300",
                color: isButtonSelected ? "white" : "black",
                "&:hover": {
                    backgroundColor: isButtonSelected ? "primary.dark" : "grey.400",
                },
            }}
        >
            {buttonType}
        </Button>
    );
}

function HeatMapRaceButton({ heatmapOpts, setHeatmapOpts, buttonType }) {
    const isButtonSelected = (heatmapOpts && heatmapOpts.length == 2 && heatmapOpts[1] === buttonType);

    return (
        <Button
            onClick={() => setHeatmapOpts([HeatMapFilters.DEMOGRAPHIC, buttonType])}
            sx={{
                backgroundColor: isButtonSelected ? "primary.main" : "grey.300",
                color: isButtonSelected ? "white" : "black",
                "&:hover": {
                    backgroundColor: isButtonSelected ? "primary.dark" : "grey.400",
                },
            }}
        >
            {buttonType}
        </Button>
    );
}