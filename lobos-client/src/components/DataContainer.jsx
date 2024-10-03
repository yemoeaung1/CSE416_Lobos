import { useEffect, useState } from "react";

import { BsArrowBarLeft, BsArrowBarRight, BsInfoCircle, BsFillBarChartFill } from "react-icons/bs";

function DataContainer({ isOpen, setIsOpen }) {
  return (
    <div className="data-container">
      <div className={`data-open-button ${isOpen ? "open" : ""}`} onClick={() => {setIsOpen(!isOpen)}}>
        {isOpen ? <BsArrowBarRight /> : <BsArrowBarLeft />}
      </div>

      <div>
        <DataToolbar isOpen={isOpen} />
        <DataComponent isOpen={isOpen} />
      </div>
    </div>
  );
}

function DataToolbar({ isOpen }){
    return (
      <div className={`data-toolbar ${isOpen ? "open" : ""}`}>

        <div className="toolbar-item">
          <BsInfoCircle className="toolbar-icon" />
          <span className="toolbar-label">Info</span>
        </div>
        <div className="toolbar-item">
          <BsFillBarChartFill className="toolbar-icon" />
          <span className="toolbar-label">Graphs</span>
        </div>
        
      </div>
    );
}

function DataComponent({ isOpen }){
  return (
    <div className={`data-component ${isOpen ? "open" : ""}`}>
    </div>
  );
}

export default DataContainer;