import React from 'react';
import './Cell.css';

class Cell extends React.Component {
	render() {
		return <div className='Cell' onClick={this.props.onClick}
			onContextMenu={this.props.onClick}
		>{this.renderContent()}</div>;
	}
	
	renderContent() {
		if (this.props.status === 0 || this.props.status === 1) {
			if (!this.props.cell.checked) {
				let flag = null;
				if (this.props.cell.flag) {
					flag = <img src='img/flag.png' alt='' style={{position: 'absolute', left:5, top:5}}/>;
				}
				return <div style={{position: 'relative'}}><img src='img/tile.png' alt=''/>{flag}</div>
			} else {
				if (this.props.cell.surroundingMineCount > 0) {
					let color = this.color(this.props.cell.surroundingMineCount);
					return <div style={{color: color}}>{this.props.cell.surroundingMineCount}</div>
				} else {
					return <div> </div>
				}
			}
		} else if (this.props.status === 2) {
			if (this.props.cell.mine) {
				if (!this.props.cell.checked) {
					return <img src='img/mine.png' alt=''/>;
				} else {
					return <img src='img/explodedMine.png' alt=''/>;
				}
			} else {
				if (this.props.cell.surroundingMineCount > 0) {
					let color = this.color(this.props.cell.surroundingMineCount);
					return <div style={{color: color}}>{this.props.cell.surroundingMineCount}</div>
				} else {
					return <div> </div>
				}
			}
		}
		
	}
	
	color(num) {
		if (this.props.cell.surroundingMineCount === 1) {
			return 'blue';
		} else if (this.props.cell.surroundingMineCount === 2) {
			return 'green';
		} else if (this.props.cell.surroundingMineCount === 3) {
			return 'red';
		} else if (this.props.cell.surroundingMineCount === 4) {
			return '#000099';
		} else if (this.props.cell.surroundingMineCount === 5) {
			return 'brown';
		} else if (this.props.cell.surroundingMineCount === 6) {
			return '#3399ff';
		} else if (this.props.cell.surroundingMineCount === 7) {
			return 'black';
		} else if (this.props.cell.surroundingMineCount === 8) {
			return 'grey';
		}
	}
}

export default Cell;