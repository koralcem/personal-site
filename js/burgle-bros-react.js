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
      columnComponents.push(<RoomColumn rooms={this.state.rooms.slice(sliceStart, sliceEnd)} onClick={this.handleClick}/>)
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
ReactDOM.render(<RoomTable rooms={allRooms}/>, document.querySelector('#container'))
