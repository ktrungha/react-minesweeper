import React from 'react';
import {PropTypes} from 'prop-types';
import './Minesweeper.css';
import Cell from './Cell';

class Minesweeper extends React.Component {
	constructor(props) {
		super(props);

		let data = this.initData(props.defaultLevel);
		
		this.state = {
				level :props.defaultLevel,
				status: 0, //0: play, 1: win, 2: lose
				time: 0,
				flagsCount: 0,
				gameStarted: false,
				data: data,
				safeCheckedCount: 0,
				interval: null,
		}
	}
	
	initData(level) {
		let x = this.getHorSize(level);
		let y = this.getVerSize(level);

		let data = new Array(y);
		for(let i = 0; i < y; i++) {
			data[i] = new Array(x)
		}
		
		for(let i = 0; i < y; i++) {
			for(let j = 0; j < x; j++) {
				data[i][j] = {
						flag: false,
						mine: false,
						surroundingMineCount: 0,
						checked: false,
				};
			}
		}
		
		this.installMines(data, this.getMinesCount(level));
		this.populateSurroundingMineCount(data, x, y);
		return data;
	}
	
	populateSurroundingMineCount(data, x, y) {
		for(let i = 0; i < y; i++) {
			for(let j = 0; j < x; j++) {
				if (data[i][j].mine) {
					if (i> 0){
						if (j>0) {
							data[i-1][j-1].surroundingMineCount += 1; 
						}
						if (j < x-1) {
							data[i-1][j+1].surroundingMineCount += 1; 
						}
						data[i-1][j].surroundingMineCount += 1; 
					}
					if (i<y-1) {
						if (j>0) {
							data[i+1][j-1].surroundingMineCount += 1; 
						}
						if (j < x-1) {
							data[i+1][j+1].surroundingMineCount += 1; 
						}
						data[i+1][j].surroundingMineCount += 1; 
					}
					if (j>0) {
						data[i][j-1].surroundingMineCount += 1;
					}
					if (j<x-1) {
						data[i][j+1].surroundingMineCount += 1;
					}
				}
			}
		}
	}
	
	installMines(data, minesCount) {
		let y = data.length;
		let x = data[0].length;
		let n = x*y;
		
		let array = new Array(n);
		for(let i = 0; i < n; i++) {
			array[i] = i;
		}

		// Run limited iteration of Fisher Yates shuffle
		let count = 0;
		for (let i = array.length - 1; count < minesCount; i--) {
	        let j = Math.floor(Math.random() * (i + 1));
	        let temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	        count++;
	    }

		for(let i = 0; i < minesCount; i++) {
			let num = array[n - 1 - i];
			let row = Math.floor(num / x);
			let col = num % x;
			data[row][col].mine = true;
		}
	}
	
	setLevel(e) {
		let level = parseInt(e.target.value, 10);
		if (!isNaN(level)) {
			this.resetGame(parseInt(e.target.value, 10));
		}
	}
	
	resetGame(level) {
		this.setState({
			time: 0,
			flagsCount: 0,
			level: level,
			data: this.initData(level),
			status: 0,
			safeCheckedCount: 0,
			interval: null,
		})
	}
	
	increaseTime() {
		let time = this.state.time;
		time++;
		this.setState({time: time})
	}

	render() {
		let statusImg = '/img/smiley.png';
		if (this.state.status === 1) {
			statusImg = '/img/win.png';
		} else if (this.state.status === 2) {
			statusImg = 'img/lose.png';
		}
		return (
				<div className='Minesweeper' style={{width: this.getHorSize(this.state.level)*34}}>
				<div className='MinesweeperLevelBar'>
					<form onClick={this.setLevel.bind(this)}>
						<div><input type='radio' value='1' name='level' defaultChecked={this.state.level === 1? 'checked': null}/>Easy</div>
						<div><input type='radio' value='2' name='level' defaultChecked={this.state.level === 2? 'checked': null}/>Medium</div>
						<div><input type='radio' value='3' name='level' defaultChecked={this.state.level === 3? 'checked': null}/>Hard</div>
					</form>
				</div>
				<div className='MinesweeperInfoBar'>
					<span>Time: {this.state.time}</span>
					<img src={statusImg} alt='' onClick={this.resetGame.bind(this, this.state.level)}/>
					<span>Remaining: {this.getMinesCount(this.state.level) - this.state.flagsCount}</span>
				</div>
				<div className='MinesweeperGrid'>
					{this.state.data.map( (row, idxr) =>{
							return <div className='MinesweeperGridRow' key={idxr} style={{width: this.getHorSize(this.state.level)*34, height:34}}>{row.map( (cell, idxc) => {
								return <Cell cell={this.state.data[idxr][idxc]}
									key={idxc}
									status={this.state.status}
									onClick={this.cellClick.bind(this, idxr, idxc)}/>
							})}</div>
					})}
				</div>
				</div>
				);
	}
	
	cellClick(idxr, idxc, e) {
		if (this.state.status === 0) {
			e.preventDefault();
			if (e.nativeEvent.button === 0) {
				if (this.state.data[idxr][idxc].flag) {
					return;
				}
				let data = this.state.data.slice();

				let status = 0;
				let safeCheckedCount = this.state.safeCheckedCount;
				let interval = this.state.interval;
				if (data[idxr][idxc].mine) {
					status = 2;
					if (interval != null) {
						clearInterval(interval);
					}
					interval = null;
					data[idxr][idxc].checked = true;
				} else {
					safeCheckedCount += this.check(idxr,idxc,data);
					if (interval === null) {
						interval = setInterval(this.increaseTime.bind(this), 1000);
					}
				}
				
				if (safeCheckedCount + this.getMinesCount(this.state.level) === data.length * data[0].length ) {
					status = 1;
					if (interval != null) {
						clearInterval(interval);
					}
					interval = null;
				}
				
				this.setState({data: data,
					status: status,
					safeCheckedCount: safeCheckedCount,
					interval: interval});
				
			} else if (e.nativeEvent.button === 2) {
				let data = this.state.data.slice();
				let flag = data[idxr][idxc].flag;
				let flagsCount;
				if (!flag) {
					data[idxr][idxc].flag = true;
					flagsCount = this.state.flagsCount + 1;
				} else {
					data[idxr][idxc].flag = false;
					flagsCount = this.state.flagsCount - 1;
				}
				this.setState({data: data,
					flagsCount: flagsCount});
			}
		}
	}
	
	check(r,c,data) {
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
				if (c>0) {
					retval += this.check(r-1,c-1,data);
				}
				if (c<data[0].length-1) {
					retval += this.check(r-1,c+1,data)
				}
				retval+= this.check(r-1,c,data);
			}
			if (r < data.length - 1) {
				if (c>0) {
					retval += this.check(r+1,c-1,data);
				}
				if (c<data[0].length-1) {
					retval += this.check(r+1,c+1,data)
				}
				retval+= this.check(r+1,c,data);
			}
			if (c>0) {
				retval += this.check(r,c-1,data);
			}
			if (c<data[0].length-1) {
				retval += this.check(r,c+1,data)
			}
			return retval;
		}
	}
	
	getHorSize(level) {
		if (level === 1) {
			return 9;
		} else if (level === 2) {
			return 16;
		} else {
			return 30;
		}
	}
	
	getVerSize(level) {
		if (level === 1) {
			return 9;
		} else if (level === 2) {
			return 16;
		} else {
			return 16;
		}
	}
	
	getMinesCount(level) {
		if (level === 1) {
			return 10;
		} else if (level === 2) {
			return 40;
		} else {
			return 99;
		}
	}
}

Minesweeper.defaultProps = {
		defaultLevel : 1,
}

Minesweeper.propTypes = {
		defaultLevel: PropTypes.number,
}

export default Minesweeper;