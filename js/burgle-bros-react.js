'use strict';

const roomTypes = {
  'Safe': 'safe',
  'Stairs': 'stair',
  'Walkway': 'beneficial',
  'Laboratory': 'beneficial',
  'Lavatory': 'beneficial',
  'Service Duct': 'special-movement',
  'Secret Door': 'special-movement',
  'Computer': 'computer',
  'Camera': 'alarm',
  'Laser': 'alarm',
  'Motion': 'alarm',
  'Detector': 'alarm',
  'Fingerprint': 'alarm',
  'Thermo': 'alarm',
  'Keypad': 'impediment',
  'Deadbolt': 'impediment',
  'Foyer': 'open-area',
  'Atrium': 'open-area',
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
            onClick={this.props.onClick}
          />
        )}
      </div>
    )
  }
}

class RoomRow extends React.Component {
  render() {
    let className = `room ${roomTypes[this.props.name]}`
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

class Board extends React.Component {
  renderSquare(index, coords) {
    return (
      <Square
        key={index}
        value={coords}
        revealed={this.props.squares[index]}
        onClick={() => this.props.onSquareClick(index)}
      />
    )
  }

  labelForRowAndColumn(row, column) {
    return String.fromCharCode('A'.charCodeAt() + column) + (row + 1).toString()
  }

  renderGrid() {
    const gridSize = 4
    let grid = []
    for (let row = 0; row < gridSize; row ++) {
      let squaresInRow = []
      for (let column = 0; column < gridSize; column++) {
        squaresInRow.push(this.renderSquare(row * gridSize + column, this.labelForRowAndColumn(row, column)))
      }
      grid.push(<div key={row}>{squaresInRow}</div>)
    }

    return grid
  }

  render() {
    return (
      <div className='table'>
        <div>{this.props.title}</div>
        {this.renderGrid()}
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

class BurgleBrosReference extends React.Component {
  onSquareClick (floor, roomIndex) {
    store.dispatch({ type: 'GUARD_TOGGLE', floor, roomIndex})
  }

  render () {
    return (
      <div>
        <RoomTable rooms={this.props.state.rooms} />
        <Board title='1st floor' squares={this.props.state.floors[0]} onSquareClick={(roomIndex) =>
          this.onSquareClick(0, roomIndex)
        } />
        <Board title='2nd floor' squares={this.props.state.floors[1]} onSquareClick={(roomIndex) =>
          this.onSquareClick(1, roomIndex)
        } />
        <Board title='3rd floor' squares={this.props.state.floors[2]} onSquareClick={(roomIndex) =>
          this.onSquareClick(2, roomIndex)
        } />
      </div>
    )
  }
}

const initialState = {
  rooms: [
    { name: 'Safe', count: 3 },
    { name: 'Stairs', count: 3 },
    { name: 'Walkway', count: 3 },
    { name: 'Laboratory', count: 2 },
    { name: 'Lavatory', count: 1 },
    { name: 'Service Duct', count: 2 },
    { name: 'Secret Door', count: 2 },
    { name: 'Computer', count: 3 },
    { name: 'Camera', count: 4 },
    { name: 'Laser', count: 3 },
    { name: 'Motion', count: 3 },
    { name: 'Detector', count: 3 },
    { name: 'Fingerprint', count: 3 },
    { name: 'Thermo', count: 3 },
    { name: 'Keypad', count: 3 },
    { name: 'Deadbolt', count: 3 },
    { name: 'Foyer', count: 2 },
    { name: 'Atrium', count: 2 },
  ],
  floors: [
    Array(16).fill(false),
    Array(16).fill(false),
    Array(16).fill(false)]
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GUARD_TOGGLE':
      const currentFloor = state.floors[action.floor]
      const newFloorState = [
        ...currentFloor.slice(0, action.roomIndex),
        !currentFloor[action.roomIndex],
        ...currentFloor.slice(action.roomIndex + 1)
      ]

      return Object.assign({}, state, {
        floors: [
          ...state.floors.slice(0, action.floor),
          newFloorState,
          ...state.floors.slice(action.floor + 1)
        ]
      })

    default:
      return state
  }
}

const store = Redux.createStore(reducer)

const render = () => {
  ReactDOM.render(<BurgleBrosReference state={store.getState()}/>, document.querySelector('#root'))
}

store.subscribe(render)
render()
