import React, { useState, useEffect } from "react";
import IncomeVotingScatter from "../GraphPlotComponents/IncomeVotingScatter";
import PrecinctDataTable from "../GraphPlotComponents/PrecinctDataTable";
import VoteShareSeatShareGraph from "../GraphPlotComponents/VoteShareSeatShareGraph";
import { Tooltip } from "@mui/material";

export function GinglesTab({ selectedState }) {
    const [selectedFilter, setSelectedFilter] = useState("income");
    const [selectedGEOID, setSelectedGEOID] = useState(null);
    const [precinctData, setPrecinctData] = useState([]);
    const [selectedAdditionalView, setSelectedAdditionalView] = useState(null);

    const isCurveDisabled = selectedState === "Utah";

    return (
        <>
            <GinglesButtons
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

export function GinglesButtons({ selectedFilter, setSelectedFilter, selectedAdditionalView, setSelectedAdditionalView, isCurveDisabled }) {
    return (
        <div className="flex items-center">
            <div className="flex-grow">
                <button
                    className={
                        selectedFilter === "income"
                            ? "font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-2 pr-2 bg-blue-400 shadow-2xl text-white"
                            : "font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-2 pr-2 hover:bg-blue-200 shadow-2xl"
                    }
                    onClick={() => setSelectedFilter("income")}
                >
                    Income
                </button>
                <button
                    className={
                        selectedFilter === "race"
                            ? "font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-2 pr-2 bg-blue-400 shadow-2xl text-white"
                            : "font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-2 pr-2 hover:bg-blue-200 shadow-2xl"
                    }
                    onClick={() => setSelectedFilter("race")}
                >
                    Racial/Ethnic
                </button>
                <button
                    className={
                        selectedFilter === "income&race"
                            ? "font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-2 pr-2 bg-blue-400 shadow-2xl text-white"
                            : "font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-2 pr-2 hover:bg-blue-200 shadow-2xl"
                    }
                    onClick={() => setSelectedFilter("income&race")}
                >
                    Income & Race
                </button>
            </div>
            <div className="flex items-center space-x-4 ml-4">
                <button
                    onClick={() => {
                        setSelectedAdditionalView(
                            selectedAdditionalView === "table"
                                ? null
                                : "table"
                        )
                    }}
                    className={`text-sm font-semibold p-2 rounded-md ${selectedAdditionalView === "table"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    Show Table
                </button>
                <Tooltip
                    title={
                        isCurveDisabled
                            ? "Curve graph is disabled for this state."
                            : ""
                    }
                    placement="top"
                    arrow
                >
                    <span>
                        <button
                            onClick={() =>
                                setSelectedAdditionalView(
                                    selectedAdditionalView === "curve"
                                        ? null
                                        : "curve"
                                )
                            }
                            className={`text-sm font-semibold p-2 rounded-md ${selectedAdditionalView === "curve"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            disabled={isCurveDisabled}
                        >
                            Show Curve Graph
                        </button>
                    </span>
                </Tooltip>
            </div>
        </div>
    );
}

export function GinglesChart({ selectedAdditionalView, selectedState, selectedFilter, setSelectedGEOID, setPrecinctData }) {
    return (
        <div className={`transition-all duration-300 ${(selectedAdditionalView) ? "h-2/4" : "h-3/4"} w-full mt-5`}>
            <IncomeVotingScatter
                selectedState={selectedState}
                selectedFilter={selectedFilter}
                onSelectGEOID={setSelectedGEOID}
                onPrecinctDataFetched={setPrecinctData}
            />
        </div>
    );
}

export function GinglesTable({ precinctData, selectedGEOID }) {
    return (
        <div className="flex-grow w-full overflow-hidden mt-6 pt-5">
            <PrecinctDataTable
                precinctData={precinctData}
                selectedGEOID={selectedGEOID}
            />
        </div>
    );
}

export function GinglesCurve({ selectedState, isCurveDisabled }) {
    if (isCurveDisabled)
        return;

    return (
        <div className="flex-grow w-full overflow-hidden mt-6 pt-5">
            <VoteShareSeatShareGraph selectedState={selectedState} />
        </div>
    );
}