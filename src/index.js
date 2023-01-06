import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
// STAR MATCH - Starting Template
const PlayStar = (props) => (
  <div>
    {utils.range(1,props.stars).map((starId) =>  (
        <div key={starId} className={"star"} />
    ))}
  </div>
);

const PlayNumber = (props) => (
  <div>
  {utils.range(1,9).map((numberId) => (

  <button
    key={numberId}
    className={"number"}
    style={{ backgroundColor: colors[props.numberStatus(numberId)] }}
    onClick={(event) => props.onClick(props.numberStatus(numberId), numberId)}
  >
    {numberId}
  </button>
  ))}
  </div>
  );

const PlayAgain = (props) => {
  return (
    <div>
      <div
        className="game-done"
        style={
          props.gameStatus == "won" ? { color: "green" } : { color: "red" }
        }
      >
        {props.gameStatus == "won" ? "WELL DONE" : "GAME OVER"}
      </div>
      <button onClick={props.onClickHandler}>Play Again</button>
    </div>
  );
};

const StarOrPlay = (props) => (
  <div>
    {props.gameStatus == "active" ? (
      <PlayStar stars={props.stars} />
    ) : (
      <PlayAgain
        onClickHandler={props.resetGame}
        gameStatus={props.gameStatus}
      />
    )}
  </div>
);

const StarMatch =() =>{
  const [gameId, setGameId] = useState(1);
  return <Game key={gameId} startNewGame={() => setGameId(gameId+1)}/>
}

const Game = (props) => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const candatesAreWrong = utils.sum(candidateNums) > stars;
  const [secondsLeft, setSecondsLeft] = useState(10);
  const gameStatus =
    availableNums.length == 0 ? "won" : secondsLeft == 0 ? "lost" : "active";

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) return "used";
    if (candidateNums.includes(number))
      return candatesAreWrong ? "wrong" : "candidate";
    return "available";
  };

  //Will replace the below with a rerendering of a component
  // const resetGame = () => {
  //   setSecondsLeft(10);
  //   setStars(utils.random(1, 9));
  //   setAvailableNums(utils.range(1, 9));
  //   setCandidateNums([]);
  // };

  function onNumberClick(numStatus, numberId) {
    if(gameStatus != "active") return;

    if (numStatus == "used") return;

    const newCandidateNums =
      numStatus == "available"
        ? candidateNums.concat(numberId)
        : candidateNums.filter((n) => n != numberId);

    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        (n) => !newCandidateNums.includes(n)
      );

      setStars(utils.randomSumIn(newAvailableNums, 9));

      setAvailableNums(newAvailableNums);

      setCandidateNums([]);
    }
  }

  const timerSetTimeout = () => {
    setTimeout(() => {
      if (gameStatus == "active") {
        if (secondsLeft == 1) {
          setCandidateNums(utils.range(1, 9));
          setSecondsLeft(secondsLeft - 1);
        } else {
          setSecondsLeft(secondsLeft - 1);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    timerSetTimeout();
  });
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          <StarOrPlay
            stars={stars}
            gameStatus={gameStatus}
            resetGame={props.startNewGame}
          />
        </div>
        <div className="right">
            <PlayNumber
              onClick={onNumberClick}
              numberStatus={numberStatus}
            />
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: "lightgray",
  used: "lightgreen",
  wrong: "lightcoral",
  candidate: "deepskyblue",
};

// Math science
const utils = {
  // Sum an array
  sum: (arr) => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

// *** The React 18 way:
// root.render(<StarMatch />);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StarMatch />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
