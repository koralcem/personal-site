'use strict';

class RoomTile {
  constructor(name, count, type) {
    this.name = name
    this.count = count    // Total occurrences of this tile in the game
    this.type = type
  }
}

class RoomTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rooms: this.props.rooms
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(roomName) {
    let rooms = this.state.rooms.slice()
    rooms.find( room => room.name === roomName ).count -= 1
    this.setState({rooms: rooms})
  }

  render() {
    const numColumns = 2
    let columnComponents = []
    for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
      const stride = this.state.rooms.length / numColumns
      const sliceStart = columnIndex * stride
      const sliceEnd = (columnIndex + 1) * stride
      columnComponents.push(
        <RoomColumn
          key={columnIndex}
          rooms={this.state.rooms.slice(sliceStart, sliceEnd)}
          onClick={this.handleClick}
        />
      )
    }

    return <div className='card'>{columnComponents}</div>
  }
}

class RoomColumn extends React.Component {
  render () {
    return (
      <div className='column'>
        {this.props.rooms.map((room) =>
          <RoomRow
            key={room.name}
            name={room.name}
            remaining={room.count}
            type={room.type}
            onClick={this.props.onClick}
          />
        )}
      </div>
    )
  }
}

class RoomRow extends React.Component {
  render() {
    let className = `room ${this.props.type}`
    if (this.props.remaining === 0) {
      className += ' out-of-game'
    }

    return (
      <div className={className} onClick={() => {
        if (this.props.remaining > 0) {
          this.props.onClick(this.props.name)
        }
      }}>
        <div>{this.props.remaining}</div>
        <div>{this.props.name}</div>
      </div>
    )
  }
}

const allRooms = [
  new RoomTile('Safe', 3, 'safe'),
  new RoomTile('Stairs', 3, 'stair'),
  new RoomTile('Walkway', 3, 'beneficial'),
  new RoomTile('Laboratory', 2, 'beneficial'),
  new RoomTile('Lavatory', 1, 'beneficial'),
  new RoomTile('Service Duct', 2, 'special-movement'),
  new RoomTile('Secret Door', 2, 'special-movement'),
  new RoomTile('Computer', 3, 'computer'),
  new RoomTile('Camera', 4, 'alarm'),
  new RoomTile('Laser', 3, 'alarm'),
  new RoomTile('Motion', 3, 'alarm'),
  new RoomTile('Detector', 3, 'alarm'),
  new RoomTile('Fingerprint', 3, 'alarm'),
  new RoomTile('Thermo', 3, 'alarm'),
  new RoomTile('Keypad', 3, 'impediment'),
  new RoomTile('Deadbolt', 3, 'impediment'),
  new RoomTile('Foyer', 2, 'open-area'),
  new RoomTile('Atrium', 2, 'open-area'),
]

ReactDOM.render(<RoomTable rooms={allRooms}/>, document.querySelector('#rooms'))


class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: Array(16).fill(false)
    }
  }

  handleClick(i) {
    const squares = this.state.squares.slice()
    squares[i] = !squares[i]
    this.setState({ squares })
  }

  renderSquare(i, coords) {
    return (
      <Square
        value={coords}
        revealed={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    )
  }

  render() {
    return (
      <div className='table'>
        <div>{this.props.title}</div>
        <div>{this.renderSquare(0, 'A1')}{this.renderSquare(1, 'B1')}{this.renderSquare(2, 'C1')}{this.renderSquare(3, 'D1')}</div>
        <div>{this.renderSquare(4, 'A2')}{this.renderSquare(5, 'B2')}{this.renderSquare(6, 'C2')}{this.renderSquare(7, 'D2')}</div>
        <div>{this.renderSquare(8, 'A3')}{this.renderSquare(9, 'B3')}{this.renderSquare(10, 'C3')}{this.renderSquare(11, 'D3')}</div>
        <div>{this.renderSquare(12, 'A4')}{this.renderSquare(13, 'B4')}{this.renderSquare(14, 'C4')}{this.renderSquare(15, 'D4')}</div>
      </div>
    )
  }
}

class Square extends React.Component {
  render() {
    return (
      <button
        className={`square ${this.props.revealed ? 'revealed' : ''}`}
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    )
  }
}

ReactDOM.render(<Board title='1st floor'/>, document.querySelector('#floor-1-table'))
ReactDOM.render(<Board title='2nd floor'/>, document.querySelector('#floor-2-table'))
ReactDOM.render(<Board title='3rd floor'/>, document.querySelector('#floor-3-table'))
