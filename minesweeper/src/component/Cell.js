import React from "react";
import "./Cell.css";
import { getCellColor } from "../logic";

class Cell extends React.Component {
  render() {
    return (
      <div
        className="Cell"
        onClick={this.props.onClick}
        onContextMenu={this.props.onClick}
      >
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    const { cell, status } = this.props;
    if (status === 0 || status === 1) {
      if (!cell.checked) {
        return (
          <>
            <img
              style={{
                backgroundColor: "transparent",
                width: "100%",
                height: "100%"
              }}
              src="img/tile.png"
              alt=""
            />
            {cell.flag && (
              <img
                src="img/flag.png"
                alt=""
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              />
            )}
          </>
        );
      } else {
        if (cell.surroundingMineCount > 0) {
          let color = getCellColor(cell.surroundingMineCount);
          return (
            <div style={{ color: color }}>{cell.surroundingMineCount}</div>
          );
        } else {
          return <div> </div>;
        }
      }
    } else if (status === 2) {
      if (cell.mine) {
        if (!cell.checked) {
          return <img src="img/mine.png" alt="" />;
        } else {
          return <img src="img/explodedMine.png" alt="" />;
        }
      } else {
        if (cell.surroundingMineCount > 0) {
          const color = getCellColor(cell.surroundingMineCount);
          return <div style={{ color }}>{cell.surroundingMineCount}</div>;
        } else {
          return <div> </div>;
        }
      }
    }
  }
}

export default Cell;
