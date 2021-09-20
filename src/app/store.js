import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../features/gameSlice.js';

export const store = configureStore({
    reducer: {
        gameStates: gameReducer
    },
});
