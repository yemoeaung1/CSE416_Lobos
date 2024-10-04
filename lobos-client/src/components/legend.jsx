const MapLegend = ({ colors, filter}) => {

    let filter_ = filter === 'race' ? 'white' : filter;
  const scale = 100;
  return (
    <div className="legend">
           <div 
        className="mx-auto mb-4 font-bold"
        style={{
          textAlign: "center",
          width: "fit-content",
          padding: "0 10px" // Optional: adds padding so the text doesn't stick to the edges
        }}
      >
        Legend ({filter_})
      </div>

      <div
        className="text-center w-24 h-20 my-2 mx-auto"
        key={0}
        style={{ backgroundColor: colors[0], display: "block" }}
      >
        100%-75%
      </div>
      <div
        className="text-center w-24 h-20 my-2 mx-auto"
        key={1}
        style={{ backgroundColor: colors[1], display: "block" }}
      >
        75%-50%
      </div>
      <div
        className="text-center w-24 h-20 my-2 mx-auto"
        key={2}
        style={{ backgroundColor: colors[2], display: "block" }}
      >
        50%-25%
      </div>
      <div
        className="text-center w-24 h-20 my-2 mx-auto"
        key={3}
        style={{ backgroundColor: colors[3], display: "block" }}
      >
        25%-0%
      </div>
    </div>
  );
};

export default MapLegend;
