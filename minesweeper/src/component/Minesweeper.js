import React from "react";
import { PropTypes } from "prop-types";
import "./Minesweeper.css";
import Cell from "./Cell";
import { initData, getMinesCount } from "../logic";

class Minesweeper extends React.Component {
  constructor(props) {
    super(props);

    let data = initData(props.defaultLevel);

    this.state = {
      level: props.defaultLevel,
      status: 0, //0: play, 1: win, 2: lose
      time: 0,
      flagsCount: 0,
      gameStarted: false,
      data: data,
      openedCellCount: 0,
      interval: null
    };
  }

  setLevel(e) {
    let level = parseInt(e.target.value, 10);
    if (!isNaN(level)) {
      this.resetGame(parseInt(e.target.value, 10));
    }
  }

  resetGame(level) {
    this.state.interval && clearInterval(this.state.interval);
    this.setState({
      time: 0,
      flagsCount: 0,
      level: level,
      data: initData(level),
      status: 0,
      openedCellCount: 0,
      interval: null
    });
  }

  increaseTime() {
    this.setState(({ time }) => ({ time: time + 1 }));
    console.log("Time");
  }

  render() {
    const { status, level } = this.state;
    let statusImg = "img/smiley.png";
    if (status === 1) {
      statusImg = "img/win.png";
    } else if (status === 2) {
      statusImg = "img/lose.png";
    }
    return (
      <div className="Minesweeper">
        <div className="MinesweeperLevelBar">
          <form onClick={this.setLevel.bind(this)}>
            <div>
              <input
                type="radio"
                value="1"
                name="level"
                checked={level === 1 ? "checked" : null}
              />
              Easy
            </div>
            <div>
              <input
                type="radio"
                value="2"
                name="level"
                checked={level === 2 ? "checked" : null}
              />
              Medium
            </div>
            <div>
              <input
                type="radio"
                value="3"
                name="level"
                checked={level === 3 ? "checked" : null}
              />
              Hard
            </div>
          </form>
        </div>
        <div className="MinesweeperInfoBar">
          <div>Time: {this.state.time}</div>
          <div style={{ flex: 0, margin: "5px" }}>
            <button
              style={{
                backgroundColor: "transparent",
                display: "flex",
                padding: "5px"
              }}
            >
              <img
                src={statusImg}
                alt=""
                onClick={this.resetGame.bind(this, level)}
              />
            </button>
          </div>
          <div>
            Remaining: {getMinesCount(this.state.level) - this.state.flagsCount}
          </div>
        </div>
        <div className="MinesweeperGrid">
          {this.state.data.map((row, idxr) => {
            return (
              <div className="MinesweeperGridRow" key={idxr}>
                {row.map((cell, idxc) => {
                  return (
                    <Cell
                      cell={this.state.data[idxr][idxc]}
                      key={idxc}
                      status={status}
                      onClick={this.cellClick.bind(this, idxr, idxc)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  cellClick(indexRow, indexColumn, e) {
    if (this.state.status === 0) {
      e.preventDefault();
      if (e.nativeEvent.button === 0) {
        if (this.state.data[indexRow][indexColumn].flag) {
          return;
        }
        let data = this.state.data.slice();

        let status = 0;
        let openedCellCount = this.state.openedCellCount;
        let interval = this.state.interval;
        if (data[indexRow][indexColumn].mine) {
          status = 2;
          if (interval != null) {
            clearInterval(interval);
          }
          interval = null;
          data[indexRow][indexColumn].checked = true;
        } else {
          openedCellCount += this.openCell(indexRow, indexColumn, data);
          if (interval === null) {
            interval = setInterval(this.increaseTime.bind(this), 1000);
          }
        }

        if (
          openedCellCount + getMinesCount(this.state.level) ===
          data.length * data[0].length
        ) {
          status = 1;
          if (interval != null) {
            clearInterval(interval);
          }
          interval = null;
        }

        this.setState({
          data,
          status,
          openedCellCount,
          interval
        });
      } else if (e.nativeEvent.button === 2) {
        let data = this.state.data.slice();
        let flag = data[indexRow][indexColumn].flag;
        let flagsCount;
        if (!flag) {
          data[indexRow][indexColumn].flag = true;
          flagsCount = this.state.flagsCount + 1;
        } else {
          data[indexRow][indexColumn].flag = false;
          flagsCount = this.state.flagsCount - 1;
        }
        this.setState({ data: data, flagsCount: flagsCount });
      }
    }
  }

  openCell(r, c, data) {
    let cell = data[r][c];
    if (cell.checked) {
      return 0;
    }

    let retval = 1;
    cell.checked = true;
    if (cell.surroundingMineCount > 0) {
      return retval;
    } else {
      if (r > 0) {
        if (c > 0) {
          retval += this.openCell(r - 1, c - 1, data);
        }
        if (c < data[0].length - 1) {
          retval += this.openCell(r - 1, c + 1, data);
        }
        retval += this.openCell(r - 1, c, data);
      }
      if (r < data.length - 1) {
        if (c > 0) {
          retval += this.openCell(r + 1, c - 1, data);
        }
        if (c < data[0].length - 1) {
          retval += this.openCell(r + 1, c + 1, data);
        }
        retval += this.openCell(r + 1, c, data);
      }
      if (c > 0) {
        retval += this.openCell(r, c - 1, data);
      }
      if (c < data[0].length - 1) {
        retval += this.openCell(r, c + 1, data);
      }
      return retval;
    }
  }
}

Minesweeper.defaultProps = {
  defaultLevel: 1
};

Minesweeper.propTypes = {
  defaultLevel: PropTypes.number
};

export default Minesweeper;
