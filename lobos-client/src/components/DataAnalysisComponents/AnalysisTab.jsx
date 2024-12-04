import React, { useState } from "react";
import IncomeVotingScatter from "../GraphPlotComponents/IncomeVotingScatter";

export default function AnalysisTab({ selectedState }) {
    const [selectedChart, setSelectedChart] = useState("precinct-analysis");

    // {graphType === "box" && <BoxPlotGraph />}
    return (
        <div className="flex flex-col h-full">
            {/* Tab Selector */}
            <div className="flex justify-end mb-4 mt-5 space-x-4">
                <button
                    className={
                        selectedChart === "precinct-analysis"
                            ? "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                            : "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
                    }
                    onClick={() => setSelectedChart("precinct-analysis")}
                >
                    Precinct Analysis
                </button>
                {/* 
                  {graphType === "line" && <LineGraph />} */}
                <button
                    className={
                        selectedChart === "ecological-inference"
                            ? "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                            : "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
                    }
                    onClick={() => setSelectedChart("ecological-inference")}
                >
                    Ecological Inference
                </button>
            </div>
            {/* Chart Display */}
            <div className="h-3/4 w-full">
                {selectedChart === "precinct-analysis" && (
                    <IncomeVotingScatter selectedState={selectedState} />
                )}
                {selectedChart === "ecological-inference" && (
                    <div>
                        {/* Replace with the other chart component */}
                        Ecological Inference Chart Component (to be added here)
                    </div>
                )}
            </div>
        </div>
    );
}
