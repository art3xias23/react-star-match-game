import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
// STAR MATCH - Starting Template
function PlayStar() {
  return <div className={"star"} />;
}

const PlayNumber = (props) => (
  <button
    className={"number"}
    style={{ backgroundColor: colors[props.status] }}
    onClick={(event) => props.onClick(props.status, props.numberId)}
  >
    {props.numberId}
  </button>
);

const PlayAgain = (props) =>{
  return(
  <div className ="game-done">
    <button onClick={props.onClickHandler}>Play Again</button>
  </div>)
}

const StarOrPlay =(props) =>{
  console.log("Is game done?", props.gameIsDone)
  return(
    <div>
  {!props.gameIsDone ?
          utils.range(1, props.stars).map((starId) => (
            <PlayStar key={starId} />
          ))
           :
          <PlayAgain onClickHandler ={props.resetGame}/>
          }
</div>
  )
}

const StarMatch = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const candatesAreWrong = utils.sum(candidateNums) > stars;
  const gameIsDone = availableNums.length==0;

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) return "used";
    if (candidateNums.includes(number))
      return candatesAreWrong ? "wrong" : "candidate";
    return "available";
  };

  const resetGame =() =>{
    setStars(utils.random(1,9));
    setAvailableNums(utils.range(1,9));
    setCandidateNums([]);
  }

  function onNumberClick(numStatus, numberId) {
    if (numStatus == "used") return;

    const newCandidateNums = 
      numStatus == "available" ?     

    candidateNums.concat(numberId) : candidateNums.filter(n => n != numberId);
    console.log("Candidate Nums", newCandidateNums);
    console.log("Available Nums", availableNums);

    if(utils.sum(newCandidateNums) !== stars){
      console.log("New Candidate Nums", newCandidateNums);
     setCandidateNums(newCandidateNums)
    }
    else{
      const newAvailableNums = availableNums.filter((n) =>
      !newCandidateNums.includes(n));

      console.log("New Available Nums",newAvailableNums);

      setStars(utils.randomSumIn(newAvailableNums, 9));

      setAvailableNums(newAvailableNums);

      setCandidateNums([]);
    }

  }
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          <StarOrPlay stars={stars} gameIsDone={gameIsDone} resetGame={resetGame} />
        </div>
        <div className="right">
          {utils.range(1, 9).map((numberId) => (
            <PlayNumber
              key={numberId}
              status={numberStatus(numberId)}
              onClick={onNumberClick}
              numberId={numberId}
            />
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: 10</div>
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
