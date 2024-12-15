import { Box, Button, ButtonGroup } from "@mui/material";
import { HeatMapFilters } from "../../enums";

export default function HeatMapInfo({ isLoading, heatmapOpts, setHeatmapOpts, legendInfo, hoveredArea }) {
    return (
        <div className="data-component-data-heatmap">
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
            <HeatMapLegendTop legendInfo={legendInfo} />
            <HeatMapLegendBottom hoveredBin={hoveredBin} />
        </div>
    );
}

function HeatMapLegendTop({ legendInfo }) {
    const entries = (legendInfo != null) ? Object.entries(legendInfo) : null;
    const splitEntries = [];

    if (entries) {
        for (let i = 0; i < entries.length; i += 4) {
            splitEntries.push(entries.slice(i, i + 4));
        }
    }

    return (
        <div className="data-component-data-heatmap-legend-top">
            <div className="averia-serif text-2xl pb-2">Legend</div>
            <div>
                {legendInfo == null &&
                    <div className="montserrat">
                        No Heat Map Selected
                    </div>
                }

                {legendInfo != null &&
                    <div className="flex flex-column gap-4">
                        {splitEntries.map((entry, index) => (
                            <HeatMapLegendBins key={index} bins={entry} />
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}

function HeatMapLegendBottom({ hoveredBin }) {
    return (
        <div className="data-component-data-heatmap-legend-bottom">
            <div className="averia-serif pb-1">Hovering:</div>
            <HeatMapLegendBin
                name={hoveredBin.name}
                color={hoveredBin.color}
                opacity={hoveredBin.opacity}
            />
        </div>
    );
}

function HeatMapLegendBins({ bins }) {
    return (
        <div>
            {bins.map(([key, { name, color, opacity }]) => (
                <HeatMapLegendBin
                    key={key}
                    name={name}
                    color={color}
                    opacity={opacity}
                />
            ))}
        </div>
    );
}

function HeatMapLegendBin({ name, color, opacity }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '2px' }}>
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    opacity: opacity,
                    border: '1px solid #000',
                }}
            ></div>
            <span className="montserrat">{name}</span>
        </div>
    );
}

function HeatMapSelection({ isLoading, heatmapOpts, setHeatmapOpts }) {
    return (
        <div className="data-component-data-heatmap-selection">
            <HeatMapSelectionTop
                isLoading={isLoading}
                heatmapOpts={heatmapOpts}
                setHeatmapOpts={setHeatmapOpts}
            />
            <HeatMapSelectionBottom
                isLoading={isLoading}
                heatmapOpts={heatmapOpts}
                setHeatmapOpts={setHeatmapOpts}
            />
        </div>
    );
}

function HeatMapSelectionTop({ isLoading, heatmapOpts, setHeatmapOpts }) {
    const heatmapButtons1 = [
        HeatMapFilters.NONE,
        HeatMapFilters.POVERTY_LEVEL,
        HeatMapFilters.DEMOGRAPHIC
    ]

    const heatmapButtons2 = [
        HeatMapFilters.ECONOMIC,
        HeatMapFilters.REGION_TYPE,
        HeatMapFilters.ECO_POLITICAL
    ]

    return (
        <div className="data-component-data-heatmap-selection-top">
            <div className="averia-serif text-2xl pb-2">Heat Map Selection</div>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                <ButtonGroup
                    variant="contained"
                    aria-label="linked button group"
                    orientation="vertical"
                    disabled={isLoading}
                >
                    {heatmapButtons1.map((element) => (
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
                    disabled={isLoading}
                >
                    {heatmapButtons2.map((element) => (
                        <HeatMapButton
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
                backgroundColor: isButtonSelected ? "primary.main" : "grey.200",
                color: isButtonSelected ? "grey.200" : "primary.main",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    backgroundColor: isButtonSelected ? "primary.dark" : "grey.300",
                },
            }}
        >
            {buttonType}
        </Button>
    );
}

function HeatMapSelectionBottom({ heatmapOpts, setHeatmapOpts }) {
    const raceOptions = [
        "Black",
        "Asian",
        "Hispanic"
    ]

    const isRaceSelectAvailable = (heatmapOpts[0] == HeatMapFilters.DEMOGRAPHIC);

    return (
        <div className={`data-component-data-heatmap-selection-bottom ${isRaceSelectAvailable ? "text-black" : "text-gray-400"}`}>
            <div className="averia-serif pb-1">Racial/Ethnic Group:</div>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                <ButtonGroup
                    variant="contained"
                    aria-label="linked button group"
                    orientation="horizontal"
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

function HeatMapRaceButton({ heatmapOpts, setHeatmapOpts, buttonType }) {
    const isButtonSelected = (heatmapOpts && heatmapOpts.length == 2 && heatmapOpts[1] === buttonType);

    return (
        <Button
            onClick={() => setHeatmapOpts([HeatMapFilters.DEMOGRAPHIC, buttonType])}
            sx={{
                backgroundColor: isButtonSelected ? "primary.main" : "grey.200",
                color: isButtonSelected ? "grey.200" : "primary.main",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    backgroundColor: isButtonSelected ? "primary.dark" : "grey.300",
                },
            }}
        >
            {buttonType}
        </Button>
    );
}