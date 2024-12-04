export default function SummaryTab({ selectedArea, selectedState }) {
    return;
    const flagMapping = {
      "Utah": UtahFlag,
      "South Carolina": SCarolinaFlag,
    };
  
    let party = (dataMapping && selectedState in dataMapping) ? dataMapping[selectedState]["Political Party"] : "N/A";
    let population = (dataMapping && selectedState in dataMapping) ? dataMapping[selectedState]["Total Population"] : "N/A";
    let income = (dataMapping && selectedState in dataMapping) ? dataMapping[selectedState]["Median Household Income"] : "N/A";
    let race = (dataMapping && selectedState in dataMapping) ? dataMapping[selectedState]["Majority Race"] : "N/A";
  
    return (
      <>
        <div className="data-component-info-top p-4">
          <div className="data-component-info-top-left">
            <div className="data-component-info-stat-box">
              <span className="font-bold underline merriweather pb-2">Population</span>
              <span className="montserrat">{`${population.toLocaleString()}`}</span>
            </div>
            <div className="data-component-info-stat-box">
              <span className="font-bold underline merriweather">Median</span>
              <span className="font-bold underline merriweather pb-2">Household Income</span>
              <span className="montserrat">{`${income.toLocaleString()}`}</span>
            </div>
          </div>
          <div className="data-component-info-top-middle p-1">
            <img
              className={"border-4 border-black p-1"}
              src={flagMapping[selectedState]}
              alt="No Flag Found"
              style={{ width: "500px", height: "333px" }}
            />
          </div>
          <div className="data-component-info-top-right">
            <div className="data-component-info-stat-box">
              <span className="font-bold underline merriweather pb-2">Majority Race</span>
              <span className="montserrat">{`${race}`}</span>
            </div>
            <div className="data-component-info-stat-box">
              <span className="font-bold underline merriweather pb-2">Majority Party</span>
              <span className="montserrat">{`${party}`}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
              <RepresentativesData dataMapping={dataMapping} selectedState={selectedState}/>
          {/* <span className="font-bold underline merriweather text-4xl mb-16">Precinct/District/County Data</span>
          <span className="font-bold underline lato text-2xl">{(selectedArea === selectedState) ? "[Select A Precinct/District/County]" : "[Information Goes Here]"}</span> */}
        </div>
      </>
    );
  }

  function RepresentativesData ({ dataMapping, selectedState }) {
    let districts = (dataMapping && selectedState in dataMapping) ? dataMapping[selectedState]["Congressional Districts"] : null;
  
    if(districts === null) {
      return <></>;
    } else {
      districts = Object.entries(districts);
      return (
        <div className="table-container">
            <table className="merriweather congress-table">
          <thead>
            <tr>
              <th className="text-xl">Congressional District</th>
              <th className="text-xl">Representative</th>
              <th className="text-xl">Party</th>
            </tr>
          </thead>
          <tbody>
            {districts.map(([districtName, details]) => (
              <tr key={districtName} className={details.Party === 'Democratic' ? 'hover:text-blue-500' : 'hover:text-red-500'}>
                <td>{districtName}</td>
                <td>{details.Representative}</td>
                <td>{details.Party}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
  
    );
    }
  };