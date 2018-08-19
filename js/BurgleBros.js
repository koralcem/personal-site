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
  }

  handleClick(roomName) {
    let rooms = this.state.rooms.slice()
    rooms.find( room => room.name === roomName ).count -= 1
    rooms = rooms.filter( room => room.count > 0 )
    this.setState({rooms: rooms})
  }

  render() {
    const totalRoomCount = this.state.rooms.reduce((total, room) => {
      return total + room.count
    }, 0)

    return (
      <table>
        <tbody>
          {this.state.rooms.map((room) =>
            <RoomRow
              key={room.name}
              name={room.name}
              remaining={room.count}
              type={room.type}
              remainingPercent={room.count / totalRoomCount}
              onClick={() => this.handleClick(room.name) }
            />
          )}
        </tbody>
      </table>
    )
  }
}

class RoomRow extends React.Component {
  render() {
    return (
      <tr className={this.props.type} onClick={() => this.props.onClick()}>
        <td>{this.props.name}</td>
        <td>{this.props.remaining}</td>
        <td>{`${Math.floor(this.props.remainingPercent * 100)}%`}</td>
      </tr>
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
