import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import GameBoard from './GameBoard.js';
import { useDispatch, useSelector } from 'react-redux';
import { saveBoardSize, selectScore, selectBoardSize, selectHighScore, saveScore, saveHighScore } from '../features/gameSlice';

function Home() {
    const dispatch = useDispatch();
    const boardSize = useSelector(selectBoardSize);
    const highScore = useSelector(selectHighScore);
    const score = useSelector(selectScore);

    const handleSizeChange = (e) => {
        e.preventDefault();
        dispatch(saveBoardSize(e.target.value))
    }

    useEffect(() => {
        var data = Number(JSON.parse(localStorage.getItem("game-highscore")));
        dispatch(saveHighScore(data));
    }, [])

    return (
        <div className="home">
            <div className="header">
                <h1>2048 Game</h1>
            </div>
            <div className="home__scoreBoard">
                <h3>HighScore : <span>{highScore}</span></h3>
                <h3 className="newScore">NewScore : <span>{score}</span></h3>
            </div>
            <form className="home__container">
                <label forhtml="matrixSize">Select Board Size</label>
                <input
                    name="matrixSize"
                    type="number" 
                    max="10"
                    min="3"
                    value={boardSize}
                    onChange={handleSizeChange}
                />
                {/* <button className="startButton">
                    START
                </button> */}
            </form>
            <GameBoard />

            <div className="helptext">
                <h2>How to play the Game?</h2> <br />
                <ul>
                    <li>Press "Arrow UP" to move/merge all numbers upwards</li>
                    <li>Press "Arrow DOWN" to move/merge all numbers downwards</li>
                    <li>Press "Arrow LEFT" to move/merge all numbers to left side</li>
                    <li>Press "Arrow RIGHT" to move/merge all numbers to right side</li>
                </ul>
                <h1>Thank you for playing!</h1>
            </div>
        </div>
    )
}

export default Home
