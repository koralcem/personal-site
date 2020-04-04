'use strict';

class PlayerNamesRow extends React.Component {
  render () {
    return (
      <tr>
        <td></td>
        {this.props.players.map(player => (
          <td key={player}>{player}</td>
        ))}
      </tr>
    )
  }
}

class CategoryRow extends React.Component {
  updatePlayerScore(e) {
    // e.target is the <input> element that was updated
    // it has a 'player' attribute on it
    // get all <input> elements with the matching 'player' attribute
    // The resulting set is the individual score elements
    // add up the values, this is the player's sum
    // dispatch action with the player number and the new score
    //
    // In the reducer, update the total score for the current player
    store.dispatch({
      type: 'SCORE_ENTERED'
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
          <TotalScoresRow scores={this.props.state.scores} />
        </tbody>
      </table>
    )
  }
}

const initialState = {
  players: [
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
  ],
  scores: [
    0,
    0,
    0,
    0,
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
      return Object.assign({}, state)

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
