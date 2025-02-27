import { Box, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { HeatMapFilters } from "../../enums";

export default function HeatMapInfo({ isLoading, heatmapOpts, setHeatmapOpts, legendInfo, hoveredArea }) {
    return (
        <div className="data-component-data-heatmap">
            <HeatMapLegend
                heatmapOpts={heatmapOpts}
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

function HeatMapLegend({ heatmapOpts, legendInfo, hoveredArea }) {
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
            <HeatMapLegendTop heatmapOpts={heatmapOpts} legendInfo={legendInfo} />
            <HeatMapLegendBottom hoveredBin={hoveredBin} hoveredArea={hoveredArea} />
        </div>
    );
}

function HeatMapLegendTop({ legendInfo }) {
    const entries = (legendInfo != null) ? Object.entries(legendInfo) : null;
    const splitEntries = [];

    if (entries) {
        entries.pop();

        for (let i = 0; i < entries.length; i += 3) {
            splitEntries.push(entries.slice(i, i + 3));
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

                {(legendInfo != null && legendInfo.type != HeatMapFilters.ECO_POLITICAL && legendInfo.type != HeatMapFilters.ELECTORAL) &&
                    <div className="flex flex-column gap-4">
                        {splitEntries.map((entry, index) => (
                            <HeatMapLegendBins key={index} bins={entry} />
                        ))}
                    </div>
                }

                {(legendInfo != null && (legendInfo.type == HeatMapFilters.ECO_POLITICAL || legendInfo.type == HeatMapFilters.ELECTORAL)) &&
                    <BichromaticLegendBins legendInfo={legendInfo} />
                }
            </div>
        </div>
    );
}

function HeatMapLegendBottom({ hoveredBin, hoveredArea }) {
    return (
        <div className="data-component-data-heatmap-legend-bottom">
            <div className="averia-serif pb-1">{`Hovering: ${(hoveredArea) ? hoveredArea.properties.NAME : ""}`}</div>
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
            />
            <span className="montserrat">{name}</span>
        </div>
    );
}

function BichromaticLegendBins({ legendInfo }) {
    const splitEntries = [];
    const allEntries = (legendInfo != null) ? Object.entries(legendInfo) : null;
    const entries = (allEntries != null) ? allEntries.map(([key, value]) => value) : null;
    const poliEntries = {
        rSplits: [],
        dSplits: []
    }

    if (entries) {
        entries.pop();
        const entriesMidPoint = entries.length / 2;

        for (let i = 0; i < entriesMidPoint; i += 1) {
            poliEntries.rSplits.push(entries[i]);
            poliEntries.dSplits.push(entries[entriesMidPoint + i]);
        }

        let entriesArr = [];
        for (let i = 0; i < entriesMidPoint; i += 1) {
            if (i !== 0 && i % 3 === 0) {
                splitEntries.push(entriesArr);
                entriesArr = [];
            }

            entriesArr.push({
                name: poliEntries.rSplits[i].name.substring(2),
                color1: poliEntries.rSplits[i].color,
                color2: poliEntries.dSplits[i].color,
                opacity1: poliEntries.rSplits[i].opacity,
                opacity2: poliEntries.dSplits[i].opacity,
            })
        }

        if (entriesArr.length !== 0)
            splitEntries.push(entriesArr);
    }

    return (
        <div className="flex flex-column gap-4">
            {splitEntries.map((entry, index) => (
                <div key={index}>
                    {entry.map((bin) => (
                        <DoubleHeatMapLegendBin
                            key={bin.name}
                            name={bin.name}
                            element={bin}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

function DoubleHeatMapLegendBin({ name, element }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '2px' }}>
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: element.color1,
                    opacity: element.opacity1,
                    border: '1px solid #000',
                }} />
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: element.color2,
                    opacity: element.opacity2,
                    border: '1px solid #000',
                }} />
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
    const heatmapButtons = [
        HeatMapFilters.NONE,
        HeatMapFilters.DEMOGRAPHIC,
        HeatMapFilters.POVERTY_LEVEL,
        HeatMapFilters.REGION_TYPE,
        HeatMapFilters.ECONOMIC,
        HeatMapFilters.ECO_POLITICAL,
        HeatMapFilters.ELECTORAL
    ]

    return (
        <div className="data-component-data-heatmap-selection-top">
            <div className="averia-serif text-2xl pb-4">Heat Map Selection</div>
            <FormControl fullWidth>
                <InputLabel id="heat-map-dropdown-label" sx={{ fontFamily: "Montserrat, san-serif" }}>Options</InputLabel>
                <Select
                    labelId="heat-map-dropdown-label"
                    value={heatmapOpts[0]}
                    onChange={(event) => setHeatmapOpts([event.target.value])}
                    label="Options"
                    disabled={isLoading}
                    sx={{ fontFamily: 'Montserrat, sans-serif', }}
                >
                    {heatmapButtons.map((option, index) => (
                        <MenuItem sx={{ fontFamily: 'Montserrat, sans-serif', }} key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
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
        <div className={`data-component-data-heatmap-selection-bottom pb-2 ${isRaceSelectAvailable ? "text-black" : "text-gray-400"}`}>
            <div className="averia-serif pb-1">Minority Group:</div>
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
                textTransform: 'none',
                padding: "2px 12px",
                minHeight: "20px",
                fontSize: "0.8rem",
                fontFamily: "Montserrat, san-serif",
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