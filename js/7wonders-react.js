'use strict';

class PlayerNamesRow extends React.Component {
  render () {
    return (
      <tr>
        <td></td>
        {this.props.players.map((player, playerIndex) => (
          <td key={playerIndex}>{player.name}</td>
        ))}
      </tr>
    )
  }
}

class CategoryRow extends React.Component {
  updatePlayerScore(e) {
    const playerNeedingUpdate = e.target.getAttribute('player')
    const playerScoreFields = document.querySelectorAll(`[player="${playerNeedingUpdate}"]`)
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
          <td key={i}><input type='number' player={i} onChange={(event) => this.updatePlayerScore(event)}/></td>
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
  switch (action.type) {
    case 'SCORE_ENTERED':
      // console.log('input changes')
      const newState = Object.assign({}, state)
      newState.players[action.playerIndex].score = action.newScore
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
