export default function StateDataTab({ setFilter }) {
    const [graphType, setGraphType] = useState("bar");
    const [dataSetType, setDataSetType] = useState("party");
  
    const handleSwitchChange = (event, type) => {
      if (event.target.checked) {
        setGraphType(type);
  
        if (type !== "bar" && dataSetType === "party") {
          setDataSetType("race");
        }
      }
    };
  
    return (
      <div className="flex flex-col h-full">
        <div className="mb-8 flex justify-between ">
          <FormControl>
            <FormLabel
              id="demo-row-radio-buttons-group-label"
              sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Graph Filters:{" "}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="bar "
                control={
                  <Radio
                    checked={graphType === "bar"}
                    onChange={(e) => handleSwitchChange(e, "bar")}
                  />
                }
                label="Bar Graph"
              />
  
              {dataSetType !== "party"  && dataSetType !== "race" && dataSetType !== "income" && dataSetType !== "age" && (
                <>
                  <FormControlLabel
                    value="box"
                    control={
                      <Radio
                        checked={graphType === "box"}
                        onChange={(e) => handleSwitchChange(e, "box")}
                      />
                    }
                    label="Box Plot"
                  />
                  <FormControlLabel
                    value="line"
                    control={
                      <Radio
                        checked={graphType === "line"}
                        onChange={(e) => handleSwitchChange(e, "line")}
                      />
                    }
                    label="Line Graph"
                  />
                </>
              )}
            </RadioGroup>
          </FormControl>
  
          {/*Buttons on the top right corner*/}
          <div className="mt-5">
            {graphType === "bar" && (
              <button
                className={
                  dataSetType === "party"
                    ? "text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                    : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
                }
                onClick={() => {
                  setDataSetType("party");
                  setFilter("republican");
                }}
              >
                Party{" "}
              </button>
            )}
  
            <button
              className={
                dataSetType === "race"
                  ? "text-2xl font-semibold border-2 border-black rounded-xl mr-4 p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                  : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
              }
              onClick={() => {
                setDataSetType("race");
                setFilter("race");
              }}
            >
              Race{" "}
            </button>
  
            <button
              className={
                dataSetType === "income"
                  ? "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                  : "text-2xl font-semibold border-2 border-black mr-4 rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
              }
              onClick={() => {
                setDataSetType("income");
                setFilter("income");
              }}
            >
              {" "}
              Income{" "}
            </button>
  
            <button
              className={
                dataSetType === "age"
                  ? "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 bg-blue-400 shadow-2xl text-white"
                  : "text-2xl font-semibold border-2 border-black rounded-xl p-1 pl-4 pr-4 hover:bg-blue-200 shadow-2xl"
              }
              onClick={() => {
                setDataSetType("age");
                setFilter("age");
              }}
            >
              {" "}
              Age{" "}
            </button>
          </div>
        </div>
  
        <div className="h-3/4 w-full">
          {graphType === "bar" && <BarGraph dataSetType={dataSetType} />}
          {graphType === "box" && <BoxPlotGraph dataSetType={dataSetType} />}
          {graphType === "line" && <LineGraph dataSetType={dataSetType} />}
        </div>
      </div>
    );
  }