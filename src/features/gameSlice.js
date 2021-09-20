import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    boardSize: 4,
    highScore: 0,
    matrix: [],
    gameover: false,
    score: 0,
}

const gameSlice = createSlice({
    name: "gameStates",
    initialState,
    reducers: {
        saveBoardSize(state, action) {
            state.boardSize = action.payload
        },
        saveMatrix(state, action) {
            state.matrix = action.payload
        },
        setGameover(state, action) {
            state.gameover = action.payload
        },
        saveScore(state, action) {
            state.score += action.payload
            if(state.score > state.highScore){
                state.highScore = state.score
                localStorage.setItem("game-highscore", JSON.stringify(state.highScore))
            }
        },
        saveHighScore(state, action) {
            state.highScore = action.payload;
        }
    }
});

export const {
    saveBoardSize, saveHighScore, saveMatrix,
    setGameover, saveScore
} = gameSlice.actions

export const selectBoardSize = (state) => state.gameStates.boardSize;
export const selectMatrix = (state) => state.gameStates.matrix;
export const selectHighScore = (state) => state.gameStates.highScore;
export const selectGameover = state => state.gameStates.gameover;
export const selectScore = state => state.gameStates.score;

export default gameSlice.reducer