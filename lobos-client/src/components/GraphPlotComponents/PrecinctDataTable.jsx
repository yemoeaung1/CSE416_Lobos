import React, { useState, useEffect } from "react";

const PrecinctDataTable = ({ precinctData, selectedGEOID }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3; // Number of rows per page

    // Calculate total pages
    const totalPages = Math.ceil(precinctData.length / rowsPerPage);

    // Pagination logic
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = precinctData.slice(startIndex, endIndex);

    // Highlight selected GEOID
    const getRowClass = (geoid) =>
        geoid === selectedGEOID ? "bg-blue-200 font-bold" : "";

    // Go to the page containing the selected GEOID
    useEffect(() => {
        if (selectedGEOID) {
            const selectedIndex = precinctData.findIndex(
                (precinct) => precinct.geoid === selectedGEOID
            );
            if (selectedIndex !== -1) {
                const page = Math.floor(selectedIndex / rowsPerPage) + 1;
                setCurrentPage(page);
            }
        }
    }, [selectedGEOID, precinctData]);

    // Handlers for pagination
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    return (
        <div className="mt-5">
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2 text-right">
                            #
                        </th>
                        <th className="border border-gray-300 p-2">
                            Total Population
                        </th>
                        <th className="border border-gray-300 p-2 text-center">
                            Region Type
                        </th>
                        <th className="border border-gray-300 p-2">
                            Non-White Population
                        </th>
                        <th className="border border-gray-300 p-2">
                            Median Income
                        </th>
                        <th className="border border-gray-300 p-2">
                            Republican Votes
                        </th>
                        <th className="border border-gray-300 p-2">
                            Democratic Votes
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((precinct, index) => (
                        <tr
                            key={index}
                            className={`${getRowClass(
                                precinct.geoid
                            )} hover:bg-gray-100`}
                        >
                            <td
                                className="border border-gray-300 p-2 text-right"
                                style={{ textAlign: "right" }}
                            >
                                {startIndex + index + 1}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {precinct.total_population}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                                {precinct.region_type}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {precinct.non_white.toLocaleString()}
                            </td>
                            <td className="border border-gray-300 p-2">
                                ${precinct.median_income.toLocaleString()}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {precinct.republican_votes.toLocaleString()}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {precinct.democrat_votes.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="bg-gray-300 p-2 rounded-md hover:bg-gray-400"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="bg-gray-300 p-2 rounded-md hover:bg-gray-400"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PrecinctDataTable;
