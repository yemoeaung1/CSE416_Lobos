const MapLegend = ({ colors }) => {
    const scale = 100;
    return (
        <div className="legend">
        <div className="text-center text-lg mb-4 mx-2">Legend</div>
            {colors.map((color, index) => {
                const quarter = scale / 4; // Calculate quarter of scale
                const currentScale = scale - (index * quarter); // Decrease scale by quarter for each color
                const nextScale = currentScale - quarter; // Get next scale
                return (
                    <div className="text-center w-24 h-20 my-2 mx-auto"
                    key={color} style={{ backgroundColor: color, display: 'block' }}>{currentScale}% - {nextScale}%</div>
                );
            })}
        </div>
    );
};


export default MapLegend;