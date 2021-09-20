import React, { useState, useEffect } from 'react';
import "./GameBoard.css";
import { useDispatch, useSelector } from 'react-redux';
import { saveMatrix, saveScore, setGameover, selectBoardSize, selectGameover, selectHighScore, selectMatrix, selectScore } from '../features/gameSlice';
import Cell from './Cell';
import cloneDeep from "lodash.clonedeep";
import GameOver from './GameOver.js';

function GameBoard() {

    const dispatch = useDispatch();
    const boardSize = useSelector(selectBoardSize);
    const highScore = useSelector(selectHighScore);
    const matrix = useSelector(selectMatrix);
    const gameover = useSelector(selectGameover);

    const [gridTemplateValue, setGridTemplateValue] = useState("80px 80px 80px 80px");
    const [fontsize, setFontSize] = useState("50px");
    const [keyPressed, setKeyPressed] = useState();
    const [newScore, setNewScore] = useState(0);
    const [grid, setGrid] = useState([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]);

    useEffect(() => {
        dispatch(saveScore(0));
        // Add event listerner for arrow key press
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            // unsubscribe event listener
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [])

    useEffect(() => {
        // Create new matrix
        dispatch(saveScore(0));
        handleMatrixSizeChange();
    }, [boardSize])

    useEffect(() => {
        switch (keyPressed) {
            case "ArrowLeft":
                moveX("LEFT");
                break;
            case "ArrowRight":
                moveX("RIGHT");
                break;
            case "ArrowUp":
                moveX("UP");
                break;
            case "ArrowDown":
                moveX("DOWN");
                break;
            default:
                break;
        }
        setKeyPressed('');
    }, [keyPressed])

    const addNumber = (newGrid) => {
        // setting random int as two
        var x1 = -1, y1 = -1, iterations = 100;
        var tempGrid = cloneDeep(newGrid)

        while(iterations--){
            x1 = Math.floor(Math.random() * boardSize);
            y1 = Math.floor(Math.random() * boardSize);
            if(tempGrid[x1][y1] === 0) {
                tempGrid[x1][y1] = 2;
                return tempGrid;
            }
        }
        dispatch(setGameover(true));

        return false;
    }

    const handleMatrixSizeChange = () => {
        // setting the grid columns and rows.
        var str= "repeat(" +  boardSize + ", "+ (85/boardSize) +"%)";
        var fsize = String(210/boardSize) + "px";
        // console.log(str, " ", fsize);
        setGridTemplateValue(str);
        setFontSize(fsize);

        // initializing new matrix
        var newGrid = [];
        for(let i=0; i < boardSize; i++){
            var row = [];
            for(let j=0; j < boardSize; j++){
                row.push(0);
            }
            newGrid.push(row);
        }

        // adding two random 2's in the grid 
        newGrid = addNumber(newGrid);
        // console.table(newGrid);
        newGrid = addNumber(newGrid);
        // console.table(newGrid);

        // save changes to state grid 
        setGrid(newGrid)
        dispatch(saveMatrix(newGrid));
    }

    const moveConditions = (tempGrid, i, j, posN, posZ, dir) => {
        var newGrid = cloneDeep(tempGrid)

        // condition for initializing the previous positions of numbers and zeroes in rows of matrix
        // then later use them to decide whether to merge numbers or just swap

        // condition for merging of number
        if(posN >= 0 && posN < boardSize){
            if(newGrid[i][j] === newGrid[i][posN] && posN !== j) {
                console.log("Number merged row" , i, " pos from ", j, " to ", posN)
                newGrid[i][posN] *= 2;
                newGrid[i][j] = 0;

                // saving new score
                dispatch(saveScore(newGrid[i][posN]));
            }
            else if(newGrid[i][j]){
                posN = j;
            };
        }
        else if(newGrid[i][j]){
            posN = j;
        };

        // logic for swapping numbers with zeroes
        if(!newGrid[i][j] && (posZ < 0 || posZ >= boardSize)){
            posZ = j;
        }
        if(posZ >= 0 && posZ < boardSize){
            if(newGrid[i][j] && posZ !== j){
                newGrid[i][posZ] = newGrid[i][j];
                newGrid[i][j] = 0;
                posN= posZ;
                posZ += dir;
                console.log("Number swapped row" , i, " pos from ", j, " to ", posZ)
            }
        }

        console.log(i, " ", j, " ", posN, " ", posZ)
        return {
            newGrid: newGrid,
            posN: posN,
            posZ: posZ,
        }
    }

    const moveConditionsY = (tempGrid, i, j, posN, posZ, dir) => {
        var newGrid = cloneDeep(tempGrid)

        // condition for initializing the previous positions of numbers and zeroes in rows of matrix
        // then later use them to decide whether to merge numbers or just swap

        // condition for merging of number
        if(posN >= 0 && posN < boardSize){
            if(newGrid[i][j] === newGrid[posN][j] && posN !== i) {
                console.log("Number merged column " , j, " pos from ", i, " to ", posN)
                newGrid[posN][j] *= 2;
                newGrid[i][j] = 0;

                // saving new score
                dispatch(saveScore(newGrid[posN][j]));
            }
            else if(newGrid[i][j]){
                posN = i;
            };
        }
        else if(newGrid[i][j]){
            posN = i;
        };

        // logic for swapping numbers with zeroes
        if(!newGrid[i][j] && (posZ < 0 || posZ >= boardSize)){
            posZ = i;
        }
        if(posZ >= 0 && posZ < boardSize){
            if(newGrid[i][j] && posZ !== i){
                newGrid[posZ][j] = newGrid[i][j];
                newGrid[i][j] = 0;
                posN= posZ;
                posZ += dir;
                console.log("Number swapped column " , j, " pos from ", i, " to ", posZ)
            }
        }

        console.log(i, " ", j, " ", posN, " ", posZ)
        return {
            newGrid: newGrid,
            posN: posN,
            posZ: posZ,
        }
    }

    const moveX = (dir) => {
        // logic for moving all cells with 2's in X direction
        var tempGrid = cloneDeep(grid)
        console.table(tempGrid)

        try {
            for(let i=0; i < boardSize; i++){
                let posN = -1, posZ = -1;
                if(dir === "RIGHT"){
                    for(let j=boardSize-1; j>=0; j--){
                        const obj = moveConditions(tempGrid, i, j, posN, posZ, -1)
                        tempGrid = obj.newGrid
                        posN = obj.posN
                        posZ = obj.posZ
                    }
                }
                else if(dir === "LEFT"){
                    for(let j=0; j<boardSize; j++){
                        const obj = moveConditions(tempGrid, i, j, posN, posZ, 1)
                        tempGrid = obj.newGrid
                        posN = obj.posN
                        posZ = obj.posZ
                    }
                }
                else if(dir === "UP"){
                    for(let j=0; j<boardSize; j++){
                        const obj = moveConditionsY(tempGrid, j, i, posN, posZ, 1)
                        tempGrid = obj.newGrid
                        posN = obj.posN
                        posZ = obj.posZ
                    }
                }
                else if(dir === "DOWN"){
                    for(let j=boardSize-1; j>=0; j--){
                        const obj = moveConditionsY(tempGrid, j, i, posN, posZ, -1)
                        tempGrid = obj.newGrid
                        posN = obj.posN
                        posZ = obj.posZ
                    }
                }
            }


            // ADDING RANDOM INTEGERS AND SAVING IT
            console.table(tempGrid)
            tempGrid = addNumber(tempGrid);
            // handling game over
            if(tempGrid === false) return;
            console.table(tempGrid)

            dispatch(saveMatrix(tempGrid));
            setGrid(tempGrid);
        }
        catch (error) {
            console.log(error);
        }
    }

    const checkGameOver = (currentGrid) => {
        var isGameOver = true;
        for(let i = 0; i < boardSize; i++){
            for(let j = 0; j < boardSize; j++){
                if(!currentGrid[i][j]) isGameOver= false;
            }
        }
        dispatch(setGameover(isGameOver));
    }

    const handleKeyPress = (e) => {
        e.preventDefault();
        setKeyPressed(e.key)
        console.log(e.key)
    }

    const gridStyle = {
        gridTemplateRows: gridTemplateValue,
        gridTemplateColumns: gridTemplateValue,
        fontSize: fontsize,
    }

    return (
        <div className="gameBoard">
            {gameover 
                ? (<GameOver /> ) 
                :
                <div 
                    className="grid-container" style={gridStyle}>
                    {grid?.map((row) => (
                        row?.map((element, index) => (
                            <Cell cellValue={element} key={index} />
                            ))
                        ))
                    }
                </div>
            }
        </div>
    )
};

export default GameBoard
