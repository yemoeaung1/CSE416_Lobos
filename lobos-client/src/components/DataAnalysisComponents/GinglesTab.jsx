import React, { useState, useEffect } from "react";
import IncomeVotingScatter from "../GraphPlotComponents/IncomeVotingScatter";
import PrecinctDataTable from "../GraphPlotComponents/PrecinctDataTable";
import VoteShareSeatShareGraph from "../GraphPlotComponents/VoteShareSeatShareGraph";
import { Box, ButtonGroup, Button, Tooltip } from "@mui/material";
import { States } from "../../enums";

export default function GinglesTab({ selectedState }) {
    const [selectedFilter, setSelectedFilter] = useState("income");
    const [selectedGEOID, setSelectedGEOID] = useState(null);
    const [precinctData, setPrecinctData] = useState([]);
    const [selectedAdditionalView, setSelectedAdditionalView] = useState(null);

    const curveDisabledStates = [States.UTAH]
    const isCurveDisabled = (curveDisabledStates.includes(selectedState));

    return (
        <>
            <GinglesButtons
                selectedState={selectedState}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                selectedAdditionalView={selectedAdditionalView}
                setSelectedAdditionalView={setSelectedAdditionalView}
                isCurveDisabled={isCurveDisabled}
            />

            <GinglesChart
                selectedAdditionalView={selectedAdditionalView}
                selectedState={selectedState}
                selectedFilter={selectedFilter}
                setSelectedGEOID={setSelectedGEOID}
                setPrecinctData={setPrecinctData}
            />

            {selectedAdditionalView === "table" && (
                <GinglesTable
                    precinctData={precinctData}
                    selectedGEOID={selectedGEOID}
                />
            )}

            {selectedAdditionalView === "curve" &&
                <GinglesCurve
                    selectedState={selectedState}
                    isCurveDisabled={isCurveDisabled}
                />
            }
        </>
    );
}

function GinglesButtons({ selectedState, selectedFilter, setSelectedFilter, selectedAdditionalView, setSelectedAdditionalView, isCurveDisabled }) {
    return (
        <div className="flex items-center justify-between pb-2">
            <GinglesTypeSelection selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
            <GinglesDisplayOptions selectedState={selectedState} selectedAdditionalView={selectedAdditionalView} setSelectedAdditionalView={setSelectedAdditionalView} isCurveDisabled={isCurveDisabled} />
        </div>
    );
}

function GinglesTypeSelection({ selectedFilter, setSelectedFilter }) {
    const filterOptions = [
        { text: "Income", value: "income" },
        { text: "Racial/Ethnic", value: "race" },
        { text: "Income & Race", value: "income&race" }
    ]

    return (
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
            <ButtonGroup
                variant="contained"
                aria-label="linked button group"
                orientation="horizontal"
            >
                {filterOptions.map((element) => (
                    <GinglesTypeButton
                        key={element}
                        selectedElement={selectedFilter}
                        setSelectedElement={setSelectedFilter}
                        buttonType={element}
                    />
                ))}
            </ButtonGroup>
        </Box>
    );
}

function GinglesDisplayOptions({ selectedState, selectedAdditionalView, setSelectedAdditionalView, isCurveDisabled }) {
    return (
        <div className="flex items-center space-x-4 ml-4">
            <Tooltip
                title={
                    isCurveDisabled
                        ? `Disabled for ${selectedState}`
                        : ""
                }
                placement="top"
                arrow
            >
                <Button
                    onClick={() => { setSelectedAdditionalView(selectedAdditionalView === "curve" ? null : "curve") }}
                    sx={{
                        textTransform: 'none',
                        padding: "4px 8px",
                        minHeight: "24px",
                        fontSize: "1.0rem",
                        fontFamily: "Montserrat, san-serif",
                        textDecoration: (selectedAdditionalView === "curve") ? "underline" : "none",
                        color: "#37474f",
                        "&:hover": {
                            backgroundColor: "grey.300",
                        },
                    }}
                    disabled={isCurveDisabled}
                    style={{
                        cursor: isCurveDisabled ? "not-allowed" : "pointer",
                    }}
                >
                    Seats-Votes Curve
                </Button>
            </Tooltip>
            <Button
                onClick={() => { setSelectedAdditionalView(selectedAdditionalView === "table" ? null : "table") }}
                sx={{
                    textTransform: 'none',
                    padding: "4px 8px",
                    minHeight: "24px",
                    fontSize: "1.0rem",
                    fontFamily: "Montserrat, san-serif",
                    textDecoration: (selectedAdditionalView === "table") ? "underline" : "none",
                    color: "#37474f",
                    "&:hover": {
                        backgroundColor: "grey.300",
                    },
                }}
            >
                Display Table
            </Button>
        </div>
    );
}

function GinglesTypeButton({ selectedElement, setSelectedElement, buttonType }) {
    const isButtonSelected = (selectedElement === buttonType.value);

    return (
        <Button
            onClick={() => setSelectedElement(buttonType.value)}
            sx={{
                textTransform: 'none',
                padding: "4px 12px",
                minHeight: "32px",
                fontSize: "1.0rem",
                fontFamily: "Montserrat, san-serif",
                backgroundColor: isButtonSelected ? "primary.main" : "grey.200",
                color: isButtonSelected ? "grey.200" : "primary.main",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    backgroundColor: isButtonSelected ? "primary.dark" : "grey.300",
                },
            }}
        >
            {buttonType.text}
        </Button>
    );
}

function GinglesChart({ selectedAdditionalView, selectedState, selectedFilter, setSelectedGEOID, setPrecinctData }) {
    const additionalCSS = `${(selectedAdditionalView) ? "h-2/4" : "h-3/4"}`;

    return (
        <div className={`transition-all duration-300 w-full mt-4 pb-3 ${additionalCSS}`}>
            <IncomeVotingScatter
                selectedState={selectedState}
                selectedFilter={selectedFilter}
                onSelectGEOID={setSelectedGEOID}
                onPrecinctDataFetched={setPrecinctData}
            />
        </div>
    );
}

function GinglesTable({ precinctData, selectedGEOID }) {
    return (
        <div className="flex-grow w-full overflow-hidden mt-6 pt-5">
            <PrecinctDataTable
                precinctData={precinctData}
                selectedGEOID={selectedGEOID}
            />
        </div>
    );
}

function GinglesCurve({ selectedState, isCurveDisabled }) {
    if (isCurveDisabled)
        return;

    return (
        <div className="flex-grow w-full overflow-hidden mt-6 pt-5">
            <VoteShareSeatShareGraph selectedState={selectedState} />
        </div>
    );
}