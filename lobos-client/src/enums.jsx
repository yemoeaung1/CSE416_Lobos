const States = Object.freeze({
    NONE: "None",
    UTAH: "Utah",
    SOUTH_CAROLINA: "South Carolina"
})

const DataTabOptions = Object.freeze({
    SUMMARY: "summary",
    ANALYSIS: "analysis",
    ENSEMBLE: "ensemble"
})

const MapViewOptions = Object.freeze({
    NONE: "None",
    STATE: "State",
    DISTRICT: "District",
    PRECINCT: "Precinct"
})

const DataFilters = Object.freeze({
    PARTY: "Party",
    RACE: "Race",
    MINORITY: "Minority Group",
    INCOME: "Income",
    REGION_TYPE: "Region Type",
})

const HeatMapFilters = Object.freeze({
    NONE: "None",
    DEMOGRAPHIC: "Demographic",
    ECONOMIC: "Economic",
    REGION_TYPE: "Region Type",
    POVERTY_LEVEL: "Poverty Rate",
    ECO_DEMOGRAPHIC: "Economic/Demographic",
    ECO_POLITICAL: "Political/Income",
    ELECTORAL: "Electoral",
})

const PoliColors = Object.freeze({
    REPUBLICAN: "#FF0000",
    DEMOCRATIC: "#0015BC",
    INDEPENDENT: "#4CAF50",
})

export { States, DataTabOptions, MapViewOptions, DataFilters, HeatMapFilters, PoliColors }