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
  renderSquare(i) {
    return (
      <Square
        key={"square_" + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isHighlighted={this.props.winningSquares.includes(i)}
      />
    );
  }

  render() {
    // Generate array of 3 squares
    const render = []
    let   tmpArr = []

    for (let i = 0; i < 9; i++) {
      tmpArr.push(this.renderSquare(i))

      if (tmpArr.length === 3) {
        render.push(tmpArr);
        tmpArr = [];
      }
    }

    // Generate 3 rows
    return (
      <div>
        {render.map((el, i) => {
          return (
            <div className="board-row" key={"row_" + i}>
              {el}
            </div>
          );
        })}
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner  = calculateWinner(current.squares);

    const moves = history.map((_step, move) => {
      const btnLabel =  move ?
      `Move n°${move}: [${history[move].location}]` :
      'Game start';

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
      status = 'Next player: ' + (this.state.xIsNext ? '🔮' : '💩');
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
          <button onClick={() => this.sortHistory()} className="btn-menu">
            Sort moves {this.state.descendingMoves ? "⬇" : "⬆" }
          </button>

          <ul>{this.state.descendingMoves ? moves : moves.reverse()}</ul>
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
