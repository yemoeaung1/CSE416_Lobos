const States = Object.freeze({
    NONE: "None",
    UTAH: "Utah",
    SOUTH_CAROLINA: "South Carolina"
})

const DataTabOptions = Object.freeze({
    SUMMARY: "summary",
    STATE_DATA: "state_data",
    ANALYSIS: "analysis",
    ENSEMBLE: "ensemble"
})

const MapViewOptions = Object.freeze({
    STATE: "State",
    DISTRICT: "District",
    PRECINCT: "Precinct"
})

const DataFilters = Object.freeze({
    DEMOGRAPHIC: "Demographic",
    ECONOMIC: "Economic",
    REGION_TYPE: "Region Type",
    POVERTY_LEVEL: "Poverty Level",
    ECO_DEMOGRAPHIC: "Economic/Demographic",
    ECO_POLITICAL: "Economic/Political"
})

export { States, DataTabOptions, MapViewOptions, DataFilters }