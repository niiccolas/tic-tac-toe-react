import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
      <button
        className={"square " + (props.isHighlighted ? "square-winning" : "")}
        onClick={() => props.onClick() }
      >
        {props.value}
      </button>
  )
}

class Board extends React.Component {
  render() {
    const nRows    = 3;
    const nSquares = 3;

    return (
      <div>
        {
          // Generate rows
          [...Array(nRows).keys()].map((row_idx)=> (
            <div className="board-row" key={"row_" + row_idx}>
              {
                // Generate squares
                // using a vanilla JS array range generator contraption
                [...Array(nSquares).keys()].map(i => i + (row_idx * nSquares)).map((sqr_idx)=> (
                  <Square
                    key={"square_" + sqr_idx}
                    value={this.props.squares[sqr_idx]}
                    onClick={() => this.props.onClick(sqr_idx)}
                    isHighlighted={this.props.winningSquares.includes (sqr_idx)}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      descendingMoves: true,
    }
  }

  displayStatus() {
    if (this.state.stepNumber > 8) {
      return "It's a draw 🤷‍♀️"
    } else {
      return 'Next player: ' + (this.state.xIsNext ? '🔮' : '💩');
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner  = calculateWinner(current.squares);

    const moves = history.map((_step, move) => {
      const btnLabel =  move ?
      `Move n°${move}: [${history[move].location}]` :
      'Game start ↩︎';

      return (
        <li key={move}>
            <button onClick={() => this.jumpTo(move)} className={
              move === this.state.stepNumber ? 'btn-moves highlight' : 'btn-moves'
            }>
              {btnLabel}
            </button>
        </li>
      );
    });

    let status;
    let winningSquares;
    if (winner) {
      status = 'Winner: ' + winner.winningPlayer;
      winningSquares = winner.winningSquares;
    } else {
      status = this.displayStatus();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winningSquares || []}
          />
        </div>
        <div className="game-info">
          <h1>{status}</h1>

          <ul>{this.state.descendingMoves ? moves : moves.reverse()}</ul>
          <button onClick={() => this.sortHistory()} className="btn-menu">
            Sort moves {this.state.descendingMoves ? "⬇" : "⬆" }
          </button>
        </div>
      </div>
    );
  }

  sortHistory() {
    this.setState({
      descendingMoves: !this.state.descendingMoves
    });
  }

  handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ]

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);

    // Halt further execution when game over or square already filled
    if (winner || squares[i]) {
      return;
    } else {
      squares[i] = this.state.xIsNext ? '🔮' : '💩';
      this.setState({
        history: history.concat([{
          squares: squares,
          location: locations[i],
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winningSquares: lines[i],
        winningPlayer: squares[a],
      }
    }
  }
  return null;
}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
