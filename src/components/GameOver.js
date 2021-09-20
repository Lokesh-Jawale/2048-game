import React from 'react';
import "./GameOver.css";
import { useDispatch, useSelector } from 'react-redux';
import { setGameover, selectGameover, saveBoardSize, selectBoardSize } from '../features/gameSlice';

function GameOver() {
    const dispatch = useDispatch();
    const gameover = useSelector(selectGameover);
    const boardSize = useSelector(selectBoardSize);

    const handlePlayAgain = (e) => {
        e.preventDefault();
        dispatch(setGameover(false));
        dispatch(saveBoardSize(3));
    }

    return (
        <div className="gameover">
            <h2>GAME OVER</h2>
            <button onClick={handlePlayAgain}>Play Again</button>
        </div>
    )
}

export default GameOver
