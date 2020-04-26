'use strict';

class AddRemovePlayersRow extends React.Component {
  removePlayer(e) {
    store.dispatch({
      type: 'REMOVE_PLAYER',
      playerIndex: Number(e.target.dataset.player)
    })
  }

  addPlayer(e) {
    store.dispatch({ type: 'ADD_PLAYER' })
  }

  render () {
    return (
      <tr>
        <td></td>
        {[...Array(this.props.numPlayers)].map((x, i) =>
          <td key={i}>
            <button
              type='button'
              data-player={i}
              onClick={(event) => this.removePlayer(event)}>
                Remove
            </button>
          </td>
        )}
        <td><button type='button' onClick={(event) => this.addPlayer(event)}>Add player</button></td>
      </tr>
    )
  }
}

class PlayerNamesRow extends React.Component {
  updatePlayerName(e) {
    const playerNeedingUpdate = e.target.dataset.nameForPlayer

    store.dispatch({
      type: 'NAME_CHANGED',
      playerIndex: Number(playerNeedingUpdate),
      newName: e.target.value
    })
  }

  render () {
    return (
      <tr>
        <td></td>
        {this.props.players.map((player, playerIndex) => (
          <td key={playerIndex}>
            <input
              type='text'
              data-name-for-player={playerIndex}
              value={player.name}
              onChange={(event) => this.updatePlayerName(event)}
            />
          </td>
        ))}
      </tr>
    )
  }
}

class CategoryRow extends React.Component {
  updatePlayerScore(e) {
    const playerNeedingUpdate = e.target.dataset.scoreForPlayer
    const playerScoreFields = document.querySelectorAll(`[data-score-for-player="${playerNeedingUpdate}"]`)
    let newScore = 0
    playerScoreFields.forEach((field) => {
      newScore += Number(field.value)
    })

    store.dispatch({
      type: 'SCORE_ENTERED',
      playerIndex: Number(playerNeedingUpdate),
      newScore
    })
  }

  render () {
    return (
      <tr>
        <td>{this.props.label}</td>
        {[...Array(this.props.numPlayers)].map((x, i) =>
          <td key={i}><input type='number' data-score-for-player={i} onChange={(event) => this.updatePlayerScore(event)}/></td>
        )}
      </tr>
    )
  }
}

class TotalScoresRow extends React.Component {
  render () {
    return (
      <tr>
        <td>Total</td>
        {this.props.scores.map((score, i) =>
          <td key={i}><input type='number' readOnly value={score} /></td>
        )}
      </tr>
    )
  }
}

class ScoreSheet extends React.Component {
  render () {
    return (
      <table>
        <tbody>
          <AddRemovePlayersRow numPlayers={this.props.state.players.length} />
          <PlayerNamesRow players={this.props.state.players}/>
          {this.props.state.categories.map(category => (
            <CategoryRow
              key={category}
              label={category}
              numPlayers={this.props.state.players.length} />
          ))}
          <TotalScoresRow scores={this.props.state.players.map(player => player.score)} />
        </tbody>
      </table>
    )
  }
}

const initialState = {
  players: [
    { name: 'Player 1', score: 0 },
    { name: 'Player 2', score: 0 },
    { name: 'Player 3', score: 0 },
    { name: 'Player 4', score: 0 },
  ],
  categories: [
    'Military',
    'Treasury',
    'Wonders',
    'Civilian',
    'Commerce',
    'Guild',
    'Science',
  ]
}

const reducer = (state = initialState, action) => {
  let newState = Object.assign({}, state)

  switch (action.type) {
    case 'SCORE_ENTERED':
      newState.players[action.playerIndex].score = action.newScore
      return newState

    case 'NAME_CHANGED':
      newState.players[action.playerIndex].name = action.newName
      return newState

    case 'ADD_PLAYER':
      newState.players.push({ name: 'New player', score: 0 })
      return newState

    case 'REMOVE_PLAYER':
      newState.players.splice(action.playerIndex, 1)
      return newState

    default:
      return state
  }
}

const store = Redux.createStore(reducer)

const render = () => {
  ReactDOM.render(<ScoreSheet state={store.getState()}/>, document.querySelector('#root'))
}

store.subscribe(render)
render()
